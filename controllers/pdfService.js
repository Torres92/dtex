
var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');
const path = require('path');
const Service = require('../models/service');
var User = require('../models/user');   
 
module.exports.createPDF = function(filteredServices, startDay, lastDay, currentMonth, lastMonth, company, driver){
    
     var tablecontent = [
            [{text: 'Fecha', style: 'tableHeader', alignment: 'center'},{text: 'Origen', style: 'tableHeader', alignment: 'center'},{text: 'Destino', style: 'tableHeader', alignment: 'center'},{text: 'Costo del servicio', style: 'tableHeader', alignment: 'center'},{text: 'Costo Adicional', style: 'tableHeader', alignment: 'center'},{text: 'total', style: 'tableHeader', alignment: 'center'}],

     ]
     if(company){
        var name = company;
        var total = 0;

        for (var i = filteredServices.length - 1; i >= 0; i--) {
            filteredServices[i].comment.newPrice = filteredServices[i].comment.newPrice.toFixed(2);
            total += filteredServices[i].comment.newPrice;
            tablecontent.push([{text: filteredServices[i].date.formattedDate, alignment: 'left'}, filteredServices[i].ori, filteredServices[i].dest, {text: 's/' + filteredServices[i].price, alignment: 'center'}, {text: 's/' + filteredServices[i].comment.charge, alignment: 'center'}, {text: parseFloat(Math.round(filteredServices[i].comment.newPrice * 100) / 100).toFixed(2), alignment:'center'}])
        }
        var igv = (total * .18).toFixed(2);
        igv = Number(igv);
        total = Number(total);
        var factura = (igv + total).toFixed(2);
        total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
     }

     if(driver) {
       var name = driver;
       var total = 0;
       filteredServices.forEach(service => {
          service.driverPrice.total = parseFloat(Math.round(service.driverPrice.total * 100) / 100).toFixed(2);
          total += service.driverPrice.total;
          tablecontent.push([{text: service.date.formattedDate, alignment: 'left'}, service.ori, service.dest, {text: 's/' + service.driverPrice.basic, alignment: 'center'}, {text: 's/' + service.driverPrice.charge, alignment: 'center'}, {text: parseFloat(Math.round(service.driverPrice.total * 100) / 100).toFixed(2), alignment:'center'}])
       });
       var igv = (total * .18).toFixed(2);
       igv = Number(igv);
       total = Number(total);
       var factura = (igv + total).toFixed(2);
       total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
       
     }  
    var documentDefinition = {
            content: [
                {
                  columns: [
                    {width: 200,text: 'DT EXPRESS', style: 'header'},
                    [
                            {
                                columns: [
                                    {
                                      // star-sized columns fill the remaining space
                                      // if there's more than one star-column, available width is divided equally
                                      width: 'auto',
                                      style: 'subheader',
                                      text: 'Razón Social:'
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' ',
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      style: 'important',
                                      width: 'auto',
                                      text: 'REVIN SERVICIOS GENERALES SAC'
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                      // star-sized columns fill the remaining space
                                      // if there's more than one star-column, available width is divided equally
                                      width: 'auto',
                                      style: 'subheader',
                                      text: 'RUC:'
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' ',
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      style: 'important',
                                      alignment: 'left',
                                      width: 'auto',
                                      text: '20603641966',
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                      // star-sized columns fill the remaining space
                                      // if there's more than one star-column, available width is divided equally
                                      width: 'auto',
                                      style: 'subheader',
                                      text: 'Dirección:'
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' ',
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      style: 'important',
                                      width: 'auto',
                                      text: 'Jr. Marco 313 U.POP TUPAC AMARU INDEPENDENCIA LIMA - LIMA',
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                      // star-sized columns fill the remaining space
                                      // if there's more than one star-column, available width is divided equally
                                      width: 'auto',
                                      style: 'subheader',
                                      text: 'Tlf:'
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' ',
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      width: '*',
                                      text: ' '
                                    },
                                    {
                                      // fixed width
                                      style: 'important',
                                      alignment: 'left',
                                      width: 'auto',
                                      text: '(01) 7721912'
                                    }
                                ]
                            }
                            ,                 
                            {
                                columns: [
                                    {
                                      // star-sized columns fill the remaining space
                                      // if there's more than one star-column, available width is divided equally
                                      width: '*',
                                      style: 'subheader',
                                      text: `Nombre: ${name}`
                                    },
                                    {
                                      // fixed width
                                      width: 'auto',
                                      style: 'subheader',
                                      text: 'Fecha:\n'
                                    },
                                    {
                                      // fixed width
                                      style: 'subheader',
                                      alignment: 'left',
                                      width: 'auto',
                                      text: `${startDay}/${currentMonth}`
                                    },
                                    {
                                      // fixed width
                                      style: 'subheader',
                                      alignment: 'left',
                                      width: 'auto',
                                      text: 'hasta:'
                                    },
                                    {
                                      // fixed width
                                      style: 'subheader',
                                      alignment: 'left',
                                      width: 'auto',
                                      text: `${lastDay}/12`
                                    }
                                ]
                            }
                        ],
                    
                    /*
                    {
                      // % width
                      width: '20%',
                      text: 'Fourth column'
                    }*/
                  ],
                  // optional space between columns
                  columnGap: 10
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['auto', '*', '*', 'auto', 'auto', 40],
                        headerRows: 1,
                        body: tablecontent
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                  style: 'tableExample',
                  table: {
                    widths: ['auto','*',50],
                    body: [
                      [
                        {
                          border: [false, true, false, false],
                          style: 'important',
                          fillColor: '#eeeeee',
                          text: 'Total'
                        },
                        {
                          border: [false, false, false, false],
                          fillColor: '#eeeeee',
                          text: ' '
                        },
                        {
                          border: [false, true, false, false],
                          style: 'important',
                          fillColor: '#eeeeee',
                          alignment: 'right',
                          text: total
                        }
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          style: 'important',
                          fillColor: '#eeeeee',
                          text: 'IGV (18%)'
                        },
                        {
                          border: [false, false, false, false],
                          fillColor: '#eeeeee',
                          text: ' '
                        },
                        {
                          border: [false, false, false, true],
                          style: 'important',
                          fillColor: '#eeeeee',
                          alignment: 'right',
                          text: igv
                        }
                      ],
                      [
                        {
                          border: [false, false, false, false],
                          style: 'important',
                          fillColor: '#eeeeee',
                          text: 'Total a facturar'
                        },
                        {
                          border: [false, false, false, false],
                          fillColor: '#eeeeee',
                          text: ' '
                        },
                        {
                          border: [false, false, false, false],
                          style: 'important',
                          fillColor: '#eeeeee',
                          alignment: 'right',
                          text: factura
                        }
                      ]
                    ]
                  },
                  layout: {
                    defaultBorder: false,
                  }
                }

            ],
            styles: {
                header: {
                    fontSize: 30,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                subheader: {
                    fontSize: 13,
                    margin: [0, 3, 0, 3]
                },
                important:{
                  fontSize: 12,
                  bold: true,
                  margins: [0,0,0,0],
                  color: 'black'
                },
                tableExample: {
                    margin: [0, 0, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    margins: [0,10,0,0],
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                 alignment: 'justify'
            },
            pageOrientation: 'landscape'
            
        };
        return documentDefinition;


}

