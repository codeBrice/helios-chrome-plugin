import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HeliosServiceService } from 'src/app/services/helios-service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts-modal.page.html',
  styleUrls: ['./contacts-modal.page.scss'],
})
export class ContactsModalPage implements OnInit {

  add = false;
  contactForm: FormGroup;
  contactsList: {}[] = [];

  constructor(private modalController: ModalController, private storage: Storage, public actionSheetController: ActionSheetController,
              private formBuilder: FormBuilder, private heliosService: HeliosServiceService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    }, {
      validator: [this.isAddress('address')]
    });

    this.storage.get( 'contacts').then(contacts => {
     this.contactsList = contacts || [];
    });
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
    this.storage.set( 'contacts', this.contactsList );
    this.add = false;
  }

  async presentActionSheet(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Contact Options',
      buttons: [{
        text: 'Edit',
        icon: 'create',
        handler: () => {
          console.log('Edit clicked');
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.contactsList.splice(index, 1);
          this.storage.set( 'contacts', this.contactsList );
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
