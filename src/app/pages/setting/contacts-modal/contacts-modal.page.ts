import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Contact } from 'src/app/entities/contact';
import { HeliosServersideService } from 'src/app/services/helios-serverside.service';
import { UserInfo } from 'src/app/entities/userInfo';
import { SecureStorage } from '../../../utils/secure-storage';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts-modal.page.html',
  styleUrls: ['./contacts-modal.page.scss'],
})
export class ContactsModalPage implements OnInit {

  add = false;
  contactForm: FormGroup;
  contactsList: Contact[] = [];
  edit = false;
  index: number;
  secret: string;
  id: number;

  constructor(private modalController: ModalController,
              private storage: Storage,
              public actionSheetController: ActionSheetController,
              private formBuilder: FormBuilder,
              private heliosService: HeliosServiceService,
              private heliosServersideService: HeliosServersideService,
              private loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              private secureStorage: SecureStorage) { }

  async ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    }, {
      validator: [this.isAddress('address')]
    });
    this.secret = await this.secureStorage.getSecret();
    const contacts = await this.secureStorage.getStorage('contacts', this.secret);
    this.contactsList = contacts || [];
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async addContact() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    const name = this.contactForm.value.name;
    const address = this.contactForm.value.address;
    try {

      const userInfo: UserInfo = await this.secureStorage.getStorage( 'userInfo', this.secret );
      if (userInfo) {
        const addContact = await this.heliosServersideService.addContact(
          this.contactForm.value.name,
          this.contactForm.value.address,
          userInfo.userName,
          userInfo.sessionHash
        );
        const result = await this.heliosServersideService.getContacts(
          userInfo.userName,
          userInfo.sessionHash
        );
        this.contactsList = result.contacts;
      } else {
        this.contactsList.push({name, address});
      }

      this.secureStorage.setStorage('contacts', this.contactsList , this.secret );

    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.errorDescription || error.message,
        duration: 2000
      });
      toast.present();
    }
    this.contactForm.reset();
    this.add = false;
    await loading.dismiss();

  }

  async editContact() {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    try {
      const name = this.contactForm.value.name;
      const address = this.contactForm.value.address;
      const userInfo: UserInfo = await this.secureStorage.getStorage( 'userInfo', this.secret );
      if (userInfo) {
        await this.heliosServersideService.deleteContact(
          this.id,
          userInfo.userName,
          userInfo.sessionHash
        );
        await this.heliosServersideService.addContact(
          name,
          address,
          userInfo.userName,
          userInfo.sessionHash
        );
        const result = await this.heliosServersideService.getContacts(
          userInfo.userName,
          userInfo.sessionHash
        );
        this.id = null;
        this.contactForm.reset();
        this.contactsList = result.contacts;
      } else {
        this.contactsList.splice(this.index, 1);
        this.contactsList.push({name, address});
      }
    } catch (error) {
      const toast = await this.toastController.create({
        cssClass: 'text-red',
        message: error.errorDescription || error.message,
        duration: 2000
      });
      toast.present();
    }

    await loading.dismiss();
    this.secureStorage.setStorage('contacts', this.contactsList , this.secret );
    this.edit = false;
  }

  async presentActionSheet(index: number, contact) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Contact Options',
      buttons: [{
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.edit = true;
          this.index = index;
          this.id = contact.id;
          this.contactForm.controls.name.setValue(contact.name);
          this.contactForm.controls.address.setValue(contact.address);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.alertController.create({
            header: 'Are you sure?',
            message: `Delete contact <strong>${contact.name}?</strong>`,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Okay',
                handler: async () => {
                  const loading = await this.loadingController.create({
                    message: 'Please wait...',
                    translucent: true,
                    cssClass: 'custom-class custom-loading'
                  });
                  await loading.present();
                  try {
                    const userInfo: UserInfo = await this.secureStorage.getStorage('userInfo', this.secret);
                    if (userInfo) {
                      await this.heliosServersideService.deleteContact(
                        contact.id,
                        userInfo.userName,
                        userInfo.sessionHash
                      );
                      const result = await this.heliosServersideService.getContacts(
                        userInfo.userName,
                        userInfo.sessionHash
                      );
                      this.contactsList = result.contacts;
                    } else {
                      this.contactsList.splice(index, 1);
                      this.secureStorage.setStorage( 'contacts', this.contactsList, this.secret );
                    }
                  } catch (error) {
                    const toast = await this.toastController.create({
                      cssClass: 'text-red',
                      message: error.errorDescription || error.message,
                      duration: 2000
                    });
                    toast.present();
                  }

                  await loading.dismiss();
                }
              }
            ]
          }).then((val) => val.present());
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  isAddress(addressData: string) {
    return (formGroup: FormGroup) => {
      const address = formGroup.controls[addressData];
      if (this.heliosService.isAddress(address.value)) {
        address.setErrors(null);
      } else {
        address.setErrors({ addressError: true });
      }
    };
  }
}
