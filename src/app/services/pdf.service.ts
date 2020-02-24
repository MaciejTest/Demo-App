import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    public usersService: UsersService,
  ) { }

  generateUserPDF(user, weather?) {
    let body = [];
    let headerTable = [
                        {text: 'Czas', style: 'very_small' },
                        {text: `Temp. [${String.fromCharCode(176)}C]`, style: 'very_small' },
                        {text: `Temp. Odcz. [${String.fromCharCode(176)}C]`, style: 'very_small' },
                        {text: `Temp. [MIN ${String.fromCharCode(176)}C]`, style: 'very_small' },
                        {text: `Temp. [MAX ${String.fromCharCode(176)}C]`, style: 'very_small' },
                        {text: 'Ciśn. [hPa]', style: 'very_small' },
                        {text: 'Wilg. [%]', style: 'very_small'  },
                        {text: `Kier. wiatru [${String.fromCharCode(176)}]`, style: 'very_small' },
                        {text: 'Pręd. wiatru [km/h]', style:'very_small' },
                     ];
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 30, 20, 30, 20 ]
    };
    let content = [];
    body.push(headerTable);
    if (weather) {
        weather.forEach((val, index) => {
              body.push([
                        {text: val.time, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small'  },
                        {text: val.temp, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.feels_like, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.temp_min, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.temp_max, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.pressure, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.humidity, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.wind, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small' },
                        {text: val.speed, alignment: 'left' , preserveLeadingSpaces: true, style: 'very_small'},
              ]);
        });
    }
    this.addStyle(docDefinition);
    content.push({ text:  'Profil użytkownika', style: 'header', margin: [0, 20, 0, 0] });
    content.push({ text:  `Imię: ${user.firstName}`, style: 'normal', margin: [0, 20, 0, 0], italics: false});
    content.push({ text:  `Nazwisko: ${user.lastName}`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `E-mail: ${user.email}`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `Miasto: ${user.city}`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `Kraj: ${user.country}`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `Rola: ${user.role}`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `Pogoda w mieście: ${user.city} w kraju: ${user.country}`, style: 'header', margin: [0, 20, 0, 0] });
    content.push({ text:  `Temperatura: ${user.temp} ${String.fromCharCode(176)}C`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    content.push({ text:  `Wilgotność: ${user.humidity}%`, style: 'normal', margin: [0, 2, 0, 0], italics: false});
    if (weather && weather.length > 0) {
        content.push({text:  'Prognoza pogody na 7 dni', style: 'header', margin: [0, 20, 0, 0] });
        content.push({table: {
                            widths: [80, 40, 60, 50, 50, 40, 30, 50, 70],
                            body: body
                      }, margin: [0, 10, 0, 0]
        });
    }
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    docDefinition['content'] = content;
    pdfMake.createPdf(docDefinition).download(`pdfUser_${user.firstName}_${user.lastName}.pdf`);
  }

  addStyle(docDefinition) {
    docDefinition['styles'] = {
      header: {
        fontSize: 10,
        alignment: 'center',
        bold: true
      },
      header2: {
        fontSize: 10,
        alignment: 'center',
        bold: false
      },
      subheader: {
        fontSize: 10,
        bold: true,
      },
      normal_ul: {
        fontSize: 9,
        margin: [0, 0, 0, 0],
        lineHeight: 1
      },
      normal: {
        fontSize: 10,
        margin: [0, 10, 0, 0]
      },
      signatures: {
        fontSize: 12,
        margin: [0, 40, 0, 0],
        alignment: 'center'
      },
      small: {
        fontSize: 9
      },
      very_small: {
        fontSize: 7
      },
      extraSmall: {
        fontSize: 7,
        color: '#939393'
      },
      italic: {
        italics: true,
        fontSize: 12,
        bold: false
      },
      defaultStyle: {
        font: 'Noway'
      }
    };
  }
}
