import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServiceService } from 'src/app/services/helios-service.service';
import { Contact } from 'src/app/entities/contact';
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

  constructor(private modalController: ModalController, private storage: Storage, public actionSheetController: ActionSheetController,
              private formBuilder: FormBuilder, private heliosService: HeliosServiceService, public alertController: AlertController,
              private secureStorage: SecureStorage) { }

  async ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    }, {
      validator: [this.isAddress('address')]
    });
    this.secret = await this.secureStorage.getSecret();
    const contacts = await this.secureStorage.getStorage('contacts', this.secret);
    if ( contacts == null){
      this.contactsList = [];
    } else {
      this.contactsList = contacts;
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  addContact() {
    const name = this.contactForm.value.name;
    const lastName = this.contactForm.value.lastName;
    const address = this.contactForm.value.address;
    this.contactsList.push({name, lastName, address});
    this.secureStorage.setStorage('contacts', this.contactsList , this.secret );
    this.add = false;
  }

  editContact() {
      this.contactsList.splice(this.index, 1);
      const name = this.contactForm.value.name;
      const lastName = this.contactForm.value.lastName;
      const address = this.contactForm.value.address;
      this.contactsList.push({name, lastName, address});
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
          this.contactForm.controls.name.setValue(contact.name);
          this.contactForm.controls.lastName.setValue(contact.lastName);
          this.contactForm.controls.address.setValue(contact.address);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          const alert = await this.alertController.create({
            header: 'Are you sure?',
            message: `Delete contact <strong>${contact.name}?</strong>`,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Okay',
                handler: () => {
                  this.contactsList.splice(index, 1);
                  this.secureStorage.setStorage('contacts', this.contactsList , this.secret );
                }
              }
            ]
          });
          await alert.present();
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
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
