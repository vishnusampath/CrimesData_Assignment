var fs = require('fs');
var readline = require('readline');
var inputFile = fs.createReadStream('crimes2001onwards.csv');
//var inputFile = fs.createReadStream('test.csv');
var rl = readline.createInterface({
  input: inputFile
});
var headers = [];
var primaryType, description, year;
var count_under500 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var count_over500 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var result = [];
rl.on('line', function(line) {
     if(headers.length === 0) {
       headers=line.split(',');
       primaryType = headers.indexOf("Primary Type");
       description = headers.indexOf("Description");
       year = headers.indexOf("Year");
     }
     else {
     var currentline = line.split(",");
     if(currentline[primaryType] === "THEFT" && (currentline[description] === "OVER $500" || currentline[description] === "$500 AND UNDER") && (currentline[year] >= 2001 && currentline[year] <= 2016))
     {
       if(currentline[description] === "OVER $500")
       {
        count_over500[currentline[year] - 2001] =  count_over500[currentline[year] - 2001] + 1;
       }
       else {
         count_under500[currentline[year] - 2001] =  count_under500[currentline[year] - 2001] + 1;
       }
     }
   }
 })
rl.on('close', function(){
   for(var i=0; i<16; i++)
   {
     var obj = {};
     obj[headers[primaryType]] = "THEFT";
     obj[headers[description]] = "OVER $500";
     obj[headers[year]] = i+2001;
     obj["Value"] = count_over500[i];
     result.push(obj);
     obj = {};
     obj[headers[primaryType]] = "THEFT";
     obj[headers[description]] = "$500 AND UNDER";
     obj[headers[year]] = i+2001;
     obj["Value"] = count_under500[i];
     result.push(obj);
   }
   var json = JSON.stringify(result, undefined,2);
   fs.writeFile("crimes_theft.json", json,function(err)
   //fs.appendFile("test_small38.json", json,function(err)
   {
     if(err){
      console.log(err);
    }
    //console.log('File saved as json');
   }); // --------- end APPENDFILE ----------------------
 });  // ---------end rl.on('end', function()) --------------
