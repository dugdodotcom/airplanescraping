var casper = require('casper').create({

    waitTimeout:20000,
    pageSettings: {
        userAgent : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6',
        loadImages:false
    }
});
var system = require('system');
var x = require('casper').selectXPath;
var month=new Array(12);
month[01]="Jan";
month[02]="Feb";
month[03]="Mar";
month[04]="Apr";
month[05]="May";
month[06]="Jun";
month[07]="Jul";
month[08]="Aug";
month[09]="Sep";
month[10]="Oct";
month[11]="Nov";
month[12]="Dec";


var oridate=casper.cli.get(6).split('-');
var orimonth=month[parseInt(oridate[1])]+" "+oridate[0];
var retdate=casper.cli.get(7).split('-');
var retmonth=month[parseInt(retdate[1])]+" "+retdate[0];
casper.start('http://www2.lionair.co.id/Default.aspx', function() {
    this.fill('form#aspnetForm', {
        'UcFlightSelection$TripType':(casper.cli.get(0)==1?'rbOneWay':'rbReturn'),
        'UcFlightSelection$txtOri':    casper.cli.get(3),
        'UcFlightSelection$txtDes':    casper.cli.get(5),
        'UcFlightSelection$ddlOri':   casper.cli.get(2),
        'UcFlightSelection$ddlDes':       casper.cli.get(4),
        'UcFlightSelection$DateFlexibility':(casper.cli.get(1)==1?'rbDateFlexible':'rbMustTravel'),
        'UcFlightSelection$ddlDepMonth':orimonth,
        'UcFlightSelection$ddlDepDay':oridate[2],
        'UcFlightSelection$ddlRetMonth':retmonth,
        'UcFlightSelection$ddlRetDay':oridate[2],
        'UcFlightSelection$ddlADTCount':casper.cli.get(8),
        'UcFlightSelection$ddlCNNCount':casper.cli.get(9),
        'UcFlightSelection$ddlINFCount':casper.cli.get(10)
    }, false);
});
casper.then(function() {
    this.click('#searchFlightsButton');
});
casper.waitForSelector('.step-progress',function() {
        var going="";
        var str="";
        var crawl="";
        var goings = casper.evaluate(function() {
            return __utils__.getElementsByXPath("//*[@id='tblOutFlightBlocks']/tbody/tr[@class='flighttable_Row']");
        });
        for(var no=1;no<=goings.length;no++){
             
            if(no==1){
                crawl='"'+no+'":{';
            }else{
                crawl=',"'+no+'":{';
            }                
                            going+=crawl+'"airplane":"'+this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[1]/div/text()'))+'"'
                            +',"detail":"'+this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[2]')).replace("<br>"," ")+'"'
                            +',"depart":"'+this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[3]')).replace("<br>"," ").replace("<b>"," ").replace("</b>"," ")+'"'
                            +',"arrive":"'+this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[4]')).replace("<br>"," ").replace("<b>"," ").replace("</b>"," ")+'"'
                            +',"promo":"'+(casper.exists(x('//*[@id="flightRowOutbound'+no+'_1"]/td[5]/span/label'))?this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[5]/span/label')).replace("<br>"," "):'')+'"'
                            +',"economy":"'+(casper.exists(x('//*[@id="flightRowOutbound'+no+'_1"]/td[6]/span/label'))?this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[6]/span/label')).replace("<br>"," "):'')+'"'
                            +',"business":"'+(casper.exists(x('//*[@id="flightRowOutbound'+no+'_1"]/td[7]/span/label'))?this.getHTML(x('//*[@id="flightRowOutbound'+no+'_1"]/td[7]/span/label')).replace("<br>"," "):'')+'"'
                    +'}';
        }
        var back="";
        var backs = casper.evaluate(function() {
            return __utils__.getElementsByXPath("//*[@id='tblInFlightBlocks']/tbody/tr[@class='flighttable_Row']");
        });

        for(no=1;no<=backs.length;no++){ 
            if(no==1){
                crawl='"'+no+'":{';
            }else{
                crawl=',"'+no+'":{';
            }
                             back+=crawl+'"airplane":"'+this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[1]/div/text()'))+'"'
                            +',"detail":"'+this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[2]')).replace("<br>"," ")+'"'
                            +',"depart":"'+this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[3]')).replace("<br>"," ").replace("<b>"," ").replace("</b>"," ")+'"'
                            +',"arrive":"'+this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[4]')).replace("<br>"," ").replace("<b>"," ").replace("</b>"," ")+'"'
                            +',"promo":"'+(casper.exists(x('//*[@id="flightRowInbound'+no+'_1"]/td[5]/span/label'))?this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[5]/span/label')).replace("<br>"," "):'')+'"'
                            +',"economy":"'+(casper.exists(x('//*[@id="flightRowInbound'+no+'_1"]/td[6]/span/label'))?this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[6]/span/label')).replace("<br>"," "):'')+'"'
                            +',"business":"'+(casper.exists(x('//*[@id="flightRowInbound'+no+'_1"]/td[7]/span/label'))?this.getHTML(x('//*[@id="flightRowInbound'+no+'_1"]/td[7]/span/label')).replace("<br>"," "):'')+'"'
                    +'}';
        }
        this.echo('{"going":{'+going+'},"back":{'+back+'}}');
});
casper.run();