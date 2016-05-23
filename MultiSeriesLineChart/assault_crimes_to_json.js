const readline = require('readline');
const fs = require('fs');

var headers=[];
var primaryType, arrest, year;
var arrestCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var noArrestCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var result=[];

const rl = readline.createInterface({
  input: fs.createReadStream('crimes2001onwards.csv')
});

rl.on('line', (line) => {

          if(headers.length === 0) {
            headers=line.split(',');
            primaryType = headers.indexOf("Primary Type");
            arrest = headers.indexOf("Arrest");
            year = headers.indexOf("Year");
          }

          else{

            var currentline = line.split(",");
            if(currentline[primaryType] === "ASSAULT" &&(currentline[year] >= 2001 && currentline[year] <= 2016))
            {
              if(currentline[arrest] === "true")
              {
               arrestCount[currentline[year] - 2001] =  arrestCount[currentline[year] - 2001] + 1;
              }
              else if(currentline[arrest] === "false"){
                noArrestCount[currentline[year] - 2001] =  noArrestCount[currentline[year] - 2001] + 1;
              }
            }
          }
});

rl.on('close', function() {
                for(var i=0;i<16;i++){
                  var obj = new Object();
                  obj[headers[year]] = i+2001;
                  obj['Arrested'] =arrestCount[i];
                  obj['NotArrested'] =noArrestCount[i] ;
                  result.push(obj);
              }

              fs.writeFile("crimes_assault.json", JSON.stringify(result, undefined, 2), function (err) {
                if (err) throw err;
                console.log('It is saved!');
              });
});
