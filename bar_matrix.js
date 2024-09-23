// BarMatrix
// CODING PROJECTS: BACK UP DAILY AND WHEN ERRORS ARE FIXED
// [WISHLIST 2.0]
// [Y]Reliable load, import, export
// [Y]Calculation for 8 elements
// [Y]Suggested bar size should use detailed lap length! ** NOT IN 1017
// [Y]Element 8 modifier doesn't work - WORKS WITH 1017
// [Y]CORRECT PRODUCT OUTPUT LINE 1
// [Y]v21 CORRECT PRODUCT OUTPUT LINE 2
// [Y]Won't order a U bar!!
// [Y]Corrected count?!?! Round up plus one!
// [Y]Allow blank spacing '-'
// [x]Beam with S bars
// [Y]U bar function
// [Y]VARY U BARS FOR CIRCULAR PAD FOOTING
// [Y]Half opacity boxes:  USED RGBA
// [Y]Added log of function names
// [Y]Fix name.backgroundColor = grey
// [Y]Save page image txt
// [Y]Load page image txt,5el
// [Y]Doesn't use cCode(colour) and cValue(cCode) correctly
//  x Get colour() click detection from proof photo selector page
// [Y]Change colour save to alpha digit
// [Y]Allow '-' in spacing box to isolate N for that line
// [Y]allow 1.5m
// [Y]DUMMY LINE?
//  x Fix blue colour (purple?!)
//  _ CIRC-UBAR DOESN'T WORK when Full Order is clicked, not Define
//  _ Fix def_beam("2400 BEAM[300x400](50 cover)(4.N20,N10-300 ligs)",5) (Element 5)
//  x Add lines to each box to make sure they are even before addline()
//  _ Correct length prediction
//  _ ALLOW LIGS IN COVER, [2400] STRAIGHT BARS
//  _ RETAINING WALLS
//  x DOWNLOAD PROJECT SPEC CSV
//  _ RETAIN AND REORDER SPECS
//  _ DARK MODE AND LIGHTER TINT SCHEMES
//  _ Fix ear sizes in lig()
//  _ add cover to [bars]
//  _ Allow COMMENT array
script_version = "4.3";
ln=2; // number of initial data in 'data
nSave=9; // number of saved strings/values
n_el=1; // current number of elements
PRODUCTSIZE=[["TMESH",5500],["SL",12.5],["N12S6",5400],["N16S6",5200],["N20S6",5000]]; // bar laps are defined per element anyway
txtHeader = "Bar Matrix v"+script_version+" \n";
txtHeader += "Paste entire file into element definition box\n";
txtHeader += "---";
COMMENT = new Array();
ALPHA_AR="A,B,C,D,E,F,G,H";ALPHA_AR=ALPHA_AR.split(',');
c_iList="R,O,Y,G,C,B,M,E";//E for grey
c_k=[7,2,3,0,5];//kanban colours + extras
c_iList=c_iList.split(",");
// nice illustration $("el1Spec").style.backgroundColor="hsla("+30*n++ +", 100%, 50%, 50%)"
//DD=221,88=136
//c_rgb="#FF0000,#FF8800,#FFFF00,#00FF00, #00FFFF,#0000FF,#FF00FF,#DDDDDD";
//colours="hsla(0, 100%, 100%, 50%)/#FF8800/#FFFF00/#00FF00/#00FFFF/#0000FF/#FF00FF/#DDDDDD";
//colours=colours.split("/");
//use alpha instead
c_rgba="rgba(255, 0, 0, 0.5)/rgba(255, 127, 0, 0.5)/rgba(255, 255, 0, 0.5)/rgba(0, 255, 0, 0.5)/rgba(0, 255, 255, 0.5)/rgba(0, 0, 255, 0.5)/rgba(255, 0, 255, 0.5)/rgba(160,160,160, 0.5)";
c_rgb="rgb(255, 0, 0)/rgb(255, 127, 0)/rgb(255, 255, 0)/rgb(0, 255, 0)/rgb(0, 255, 255)/rgb(0, 0, 255)/rgb(255, 0, 255)/rgb(160,160,160)";
//c_ha="0,30,60,120,180,240,300";
c_rgba=c_rgba.split("/");
c_rgb=c_rgb.split("/");
// but they get spliced off so it shouldn't be used
function $(el) {return document.getElementById(el);}
function log(t) { console.log(t); return t; }
function plural(n,unit) { return n+" "+unit+((n>1)?'s':''); }
function version() { alert("HTML version "+HTML_version+"\nScript version "+script_version); }
function version_number() { return Number(HTML_version)*1000+Number(script_version)*10; }
function colour(div) { // cycle colours
   log('v4.1 function colour('+div.id+')');
   nCol=1; //indexed colour, 1 if unsaved
   if(div.style.backgroundColor) {
      //log(div.style.backgroundColor);
      i_rev = c_rgb.indexOf(div.style.backgroundColor);
      if(i_rev==-1) {
         i_rev = c_rgba.indexOf(div.style.backgroundColor);
         log("Matching colour to rgba: "+c_rgba[i_rev]); }
      //log(i_rev);
      nCol = ((i_rev>-1)?c_k.indexOf(i_rev):0);
      nCol++; }
   if(nCol==-1)
      nCol=0;
   if(nCol>=c_k.length)
      nCol=0; // cycle
   log("nCol="+nCol+", rgba:"+c_rgba[c_k[nCol]]);
   div.style.backgroundColor=c_rgba[c_k[nCol]];
}
// IF IT WORKS, BACK IT UP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function initialC(rgbx) { // return initial from kanban colour values
   return cCode(rgbx); // I don't remember why I created initialC()
   rgbx=rgbx.replace("rgba","rgb");
   rgbx=rgbx.replace(", 0.5)",")");
   log("rgbx:"+rgbx);
   iRev = c_rgb.indexOf(rgbx); //index of colour and initial
   if(iRev==-1) { log("Colour "+rgbx+" still not found in initialC");
      iRev = c_rgba.indexOf(rgbx); }
   return c_k.indexOf(c_iList[iRev]); // hope this works
   ci = c_k.indexOf(iRev);
   if(iRev==-1)
      ci = 0;
   return c_iList[c_k[ci]];//fudge fixes it? DISUSED AS ARE LAST THREE LINES
}
function textract(t, char_ar) { // TWO ARGUMENTS
   char_ar = char_ar.split(",");
   return t.split(char_ar[1])[0].split(char_ar[0])[1];
}
function padftg(el, barSp, dimension, qty=1, comment="") { // cover already removed? WON'T ACCEPT 3/N12
   log('padftg(el='+el+', barSp='+barSp+', dimension:'+dimension+', qty=1, comment="")');
   // four bars, first define top short
   // dimension = "lxwxh"
   if(barSp.indexOf("/")!=-1)
   { qty = barSp.split("/")[0]; barSp=barSp.split("/")[1]; }
   dimension=dimension.split("x");
   //for(i in dimension) dimension[i] = Math.floor(dimension[i]); // doesn't work!!!
   if(dimension[1]>dimension[0]) // convention, largest first
   {  temp = dimension[1];
      dimension[1] = dimension[0];
      dimension[0] = temp; }
   barsize = eval(barSp.substring(1,2)); // what if it's 3/N12
   bar(el, barSp.split("-")[0], [dimension[2],dimension[1],dimension[2]], Math.floor(dimension[0]/barSp.split("-")[1]+2), $("el"+el+"Name").value+" D bar");
   b_c_height = dimension[2]-eval(barSp.substring(1,2))-3.5*barsize; //minor distance-subtract 3.5*d
   bar(el, barSp.split("-")[0], [b_c_height,dimension[0],b_c_height], Math.floor(dimension[1]/barSp.split("-")[1]+2), $("el"+el+"Name").value+" C bar"); // C bar
   bar(el, barSp.split("-")[0], [b_c_height,dimension[0]-2*barsize,b_c_height], Math.floor(dimension[1]/barSp.split("-")[1]+2), $("el"+el+"Name").value+" B bar"); // B bar
   bar(el, barSp.split("-")[0], [b_c_height+2*barsize,dimension[1],b_c_height+2*barsize], Math.floor(dimension[0]/barSp.split("-")[1]+2), $("el"+el+"Name").value+" A bar"); // A bar
}
// IF IT WORKS, BACK IT UP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function bar(el, bar, dimension, qty=1, comment="") { // loads a U bar into an element
   log('v4.1 function bar()');
   for(i in dimension) dimension[i] = Math.floor(dimension[i]);
   spacing = "-";
   switch(dimension.length) {
      case 1:
         log("Loaded "+bar+" straight bar: "+comment);
         product = bar;
         spacing = "["+dimension[0]+"]"; break;
      case 2:
         log("Loaded "+bar+" L-bar: "+comment);
         product = bar+"L("+dimension[0]+"x"+dimension[1]+")";
         break;
      case 3:
         log("Loaded "+bar+" U-bar: "+comment);
         product = bar+"U("+dimension[1]+"x"+dimension[0]+")";
         break;
      case 4:
         log("Loaded "+bar+" lig: "+comment);
         product = bar+" lig("+dimension[1]+"x"+dimension[0]+")";
         break;
      default: log("Unknown bar() called with "+n+" lengths");
   }
   equalise(el);
   addLine("el"+el+"p",product);
   addLine("el"+el+"s",spacing);
   addLine("el"+el+"n",qty);
}
function equalise(el) { // if the boxes have uneven rows, clear them! It might just be a default "-"
   rows = $("el"+el+"p").value.split("\n").length;
   if(($("el"+el+"s").value.split("\n").length!=rows)|($("el"+el+"n").value.split("\n").length!=rows)) {
      $("el"+el+"p").value = "";
      $("el"+el+"s").value = "";
      $("el"+el+"n").value = "";
   }
}
function textractr(t, char_ar) { // TWO ARGUMENTS
   char_ar = char_ar.split(",");
   return t.split(char_ar[1])[0].split(char_ar[0])[1];
} // BAR FUNCTION BELOW
function ubar(el, bar, base, height, qty=1, comment) { // loads a U bar into an element
   product = bar+"U("+base+"x"+height+")";
 // BAR FUNCTION BELOW
   equalise(el);
   addLine("el"+el+"p",product);
   addLine("el"+el+"s","-");
   addLine("el"+el+"n",qty);
   log("Loaded U-bar: "+comment);
}
function elClear(el) {
   log('v4.1 function elClear()');
      $("el"+el+"p").value="";
      $("el"+el+"s").value="";
      $("el"+el+"n").value="";
      $("el"+el+"Name").value="";
      $("el"+el+"Length").value="";
      $("el"+el+"Lengths").value="";
}
function define(lineSpec="",elSpec=-1) { // generate takeoff boxes with lengths
   log("define('"+lineSpec+"')"); // always defines nothing, fine
   t = $("takeoff").value.toUpperCase().split("\n");
   if(lineSpec=="") {
      line = t[0].split("(");
/*DUAL N16 LBAR VARY (700 LAP):
1000
(5) INTERIM VARIED BARS
2000
(10)
500*/
      i=0;
      if(line[i].substring(line.length-10)=='BAR VARY ') { //+"700 LAP, 300H)"
         vals = t; // who knows what this is about
         title = vals[0].split('BAR VARY (');
         vals.splice(1);
         val[0] = Number(vals[0]);
         vals.join("\n");
         vals.split("\n(");
         // vary L bar from x to y
         //bar(1, "N20",[200,1000,200],2,"starter")
         log("N16 only in define()");
         h = title[1].split(", ");
         lap = h[0].substring(0,h[0].indexOf(" ")-1);
         h = h[1].substring(0,h[1].indexOf(" ")-1);
         bar(elSpec, "N16", [h, (l+lap)/2],2);
/*DUAL LBAR VARY (700 LAP, 300H
1000
(5) INTERIM VARIED BARS
2000
(10)
500*/
         //return;
      }

   }
   log('lineSpec[0]:'+lineSpec[0]);
   if(lineSpec[0]=="3")
      alert("Victory!");
   if(elSpec) { // it's been called on an element, not a line
      elClear(elSpec);
      if(lineSpec=="") {
         t = $("takeoff").value.toUpperCase();
         log(t);
         lineSpec = t.split("\n");
         for(var i=0; i<lineSpec.length;i++) {
            log("def_proc launch "+i);
            def_proc(lineSpec[i],elSpec); // will be in brackets
            log("def_proc completed "+i); }
      }
   } //else they canceled*/
}
function first_defline(lineSpec="") {
   if(linespec=="") return "";
   par = linespec.indexOf("(");
   bra = linespec.indexOf("[");
   iBracket = bra;
   if(par>bra)
      iBracket = par;
   if(iBracket==-1)
      return "";
   else
      return lineSpec.substring(0,iBracket-1);
}
function floor(n) { //round to 1
   return Math.floor(n);
}
////// debug output before freeze/////
//allowed d=12
//bar_matrix.js:39 readNum(5000],0)
function setTitle() {
   document.title="[ "+$("o_id").value+" ]";
}
function def_proc(lineSpec="",el=-1) {
   log('v4.1 function def_proc('+((el>=0)?el:"")+')');
   d=12; log("allowed d=12");
   i_c = lineSpec.indexOf(":");
   if((i_c!=-1)&(i_c<4)&isNum(lineSpec.substring(0,i_c))) { // load into specified box
      n=lineSpec.substring(0,i_c);
      equalise(n); // if they're uneven, clear them
   }
   lineSpec=lineSpec.split("["); // splite off cover
   if(t.split("\n").length>1)
      alert("def_proc() error - Single line only");
   lineSpec[2]=lineSpec[2].split("](");
   strBars = lineSpec[2][0];
   bars = lineSpec[2][0].split("-");
   log(bars);
   s = bars[1]; // spacing
   D = readNum(lineSpec[1], 0,98)-2*readNum(lineSpec[2][1],0,98);
   n = D/s+1;
   if(n!=Math.floor(n)) n++; // round up
   n=Math.floor(n);
   c = readNum(lineSpec[2][1],0,105);
   //BEAM BY DEFAULT BUT
   //    0        1        2,0      2,1
   //CIRC-UBAR[ 5000][ <N12-200](50 cover):GRID>
   if(lineSpec[0].substring(0,9)=="CIRC-UBAR") {
      $("el"+el+"Name").value = "CIRCULAR "+(D+2*c)+"D, "+strBars;
      log(lineSpec[1]); // do we get through the next readnum?
      // actual spacing
      s = (D-2*c)/(n-1); // offset the centre of the bar
      log("500 nominal U bar height");
      if(n%2==1){ // allow a central bar
         ubar(el, bars[0], D-2*c, 500, 1, "CENTRAL");
         log('for(var i=0;i<'+(n-1)/2+';i++)');
         for(var i=1;i<(n-1)/2;i++) { // use Pythag not trig
             // new offset, i*s
            L = 2*Math.sqrt(D*D/4-(i*s)*(i*s));
            log(floor(L)+" = 2*Math.sqrt("+(D*D/4)+"-"+floor((i*s)*(i*s))+')');
            ubar(el, bars[0], Math.floor(L), 500,2,""+(i*s)+" OFFSET");
         }
         log(["inDs:",i,n,D,s]);
         log("Allowing 2x2 U bars");
         ubar(el, bars[0], 200, 500,2, "OUTERMOST"); // pretend this is right at the extent of cover, D/2-c from centre
      } else { // even number of bars?
         // first offset s/2
         for(var o=s/2; o<D/2; o+=s) {
            L = 2*Math.sqrt(D*D/4-o*o);
            log(L+" = 2*Math.sqrt("+(D*D/4)+"-"+o*o+')');
            ubar(el, bars[0], Math.floor(L), 500,2,(i*s)+" OFFSET");
         }
      }
   }
}

function def_beam(lineSpec="",el=-1) {
   // below is for A BEAM
   //2400 BEAM[300x400](50 cover)(4.N20,N10-300 ligs)
                  //   0        1      2-0      2-1-0  2-1-2
   log(["t:",t]);//'CIRC-UBAR[5000][N12-200](50 COVER):GRID'
   l = Number(t.split(" ")[0]);
   size = t.split("[")[1].split("]")[0];//.split("x");
   size=size.replace("X","x");
  // log(size);
   //log(typeof size);
   //size = size.toLowerCase();
   cover = Number(textract(t,"(` COVER"));
   $("el"+el+"Name").value="Beam "+el;//+" "+l+"x"+size;
   $("el"+el+"Length").value=l;
   $("el"+el+"Lengths").value=1;
   t=t.split("(");
   t2=t[2];
   log(t2);
   bars=t[2].split("](")[0];
   log(bars[0].split(".")[1]);
   if($("el"+el+"s").value=="-")
        $("el"+el+"s").value="";
   addLine("el"+el+"p",bars[0].split(".")[1]+"["+l+"]");
   addLine("el"+el+"s","-");
   addLine("el"+el+"n",bars[0].split(".")[0]);
   // add the ligs
   bars=bars[1].split(" ligs")[0].split("-");
   addLine("el"+el+"p",bars[0]+"["+size+"]");
   addLine("el"+el+"s",bars[1].split(" ")[0]);
   //addLine("el"+el+"n",bars[0].split(".")[0]);
   change($("el"+el+"s"));
}
function addLine(box,text) {
   log('v4.1 function addLine()');
//   if($(box).value.split("\n").length<$("el"+readNum(box.id,2)+"p").value.split("\n").length
   $(box).value += ($(box).value?"\n":"")+text;
}
function order() { // generate takeoff boxes with lengths
//   $("specBoxes").innerHTML=""; // so that I can add each box
   n=document.n;
   takeoff = $("takeoff").value.toUpperCase();
   scale_index = 0;
   if(takeoff.indexOf("SCALE")!=-1)
      scale_index = 1;
   takeoff=takeoff.trim().split('\n');
//   alert(takeoff.length-scale_index); // must splice it out of array later when parsing
   if(takeoff[0].split(" ")[0]=="Colour")
      takeoff.splice(0,1);
   new_n = takeoff.length-scale_index;

  // log("i from "+n+" to "+(takeoff.length-scale_index-n+1));
   for(var i=n;i<new_n;i++)
      newSpec();
   //alert(new_n); //GENERATES THE CORRECT NUMBER
   for(var i=0;i<=new_n-1;i++) {
      log('v4.1 function order()');
      n=i+1;
     // log(takeoff[i]);
      name = takeoff[i].split("\t")[0];
      log("Name:"+name);
      if((name.substring(0,5) == "SCALE")|(name.substring(0,6) == "COLOUR")) { // jump over it - CAPITALISED!
         log("Splicing out "+i);
         takeoff.splice(i,1);
         new_n--;
         continue;
      }
      length = takeoff[i].split(")");
      length=length[length.length-1].trim();
      if(length.length<10) // single value: no area recorded
         length = Number(length);
      else
         length=readNum(length,0,178); // ignores slab perimeter
      lengths = Number(takeoff[i].split("(")[1].split(")")[0]); // use the first bracket set
      $("el"+n+"Name").value = name;
//      setTimeout('$("el'+i+'Name").value="'+name+"'",10);
      if(length+lengths<200)//say, we're after a count
      { lengths = ((length>lengths)?length:lengths);// greater
        length=0; }
      $("el"+i+"Length").value=length;
      $("el"+i+"Lengths").value=lengths;
   }
   for(var i=0; i<document.n; i++)
      product_change($("el"+i+"p")); // refresh
}
function ancestor(el, n) { // returns the nth ancestor of el
   if(n==0)
      return el;
   else
      return ancestor(el.parentElement, n-1);
}
function load() { // loads from localstorage data after refresh
   log('v4.1 function load()');
   body = document.getElementsByTagName("BODY")[0];
   body.addEventListener('click', (event) => {
      //     event.stopPropagation();
      //log("event.stopPropagation() attempt");
      el=event.target;
      log(el.tagName+" was clicked, "+el.id);
      if(el.tagName!="TD")
         return;
      el = ancestor(el,4);
      log("4th ancestor, id: "+el.id+", colour: "+el.style.backgroundColor);
      colour(el);
   });
   data = localStorage.data;
   if(!data) { // data
      alert("No saved data found"); // THE END
      return; }
   data=data.split("|"); // 3 brackets deep
   if((data[0].substring(0,6)!="Matrix")) { // labelled Matrix5
      alert("No saved data found.");
      return; }
   else { // load o_id
      if(false){//readNum(data[0],3)<1.5) { // todo
         data.splice(0,1);
         $('o_id').value="Project, schedule?";
      } else {
         $('o_id').value = data[1];//seems to be set anyway
         data.splice(0,1); // splice off first 2, don't need ln!
      }
   }
   data.splice(0,1); // ???
   n = (data.length)/nSave; //n=3; // for testing
  // log(plural(n, "element")+" loaded");
   document.n = n;
   // duplicate boxes before loading data into them
   for(var i=1;i<n;i++) {
      newSpec();
   }//*/
//   return; // before data is accessed that isn't there
//   log("data:");log(data);
//   alert("ln="+ln); unused now
   for(var i=0;i<n;i++) {
     // log("Loading "+data[i*nSave]);
      a=1; // test with a=0
      $('el'+(i+a)+'Name').value = data[i*nSave];
      $('el'+(i+a)+'Length').value = data[i*nSave+1];
      $('el'+(i+a)+'Lengths').value = data[i*nSave+2];
      //log($('el'+(i+a)+'p'));
      $('el'+(i+a)+'p').value = data[i*nSave+3].split("/").join('\n');
      $('el'+(i+a)+'s').value = data[i*nSave+4].split("/").join('\n');
     // log('$(el'+(i+a)+'s).value = "'+data[i*nSave+3]+"'.split('/').join('\n')");//data[10]?
      $('el'+(i+a)+'n').value = data[i*nSave+5].split("/").join('\n');
      $('el'+(i+a)+'c').value = data[i*nSave+6];
      $('el'+(i+a)+'l').value = data[i*nSave+7];
      col = data[i*nSave+8];
      if(col.indexOf("rgb")==-1)
         col = cValue(col); // col must be the initial?
      $('el'+(i+a)+'Spec').style.backgroundColor = col;
      product_change($('el'+(i+a)+'p'));
   }
   setTitle();
   setInterval(savelink,10000);// autosave every ten seconds
}
function download(filename, text) {
   log('v4.1 function download()');
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();  document.body.removeChild(element);
}
function newSpec(n=0) {
   log('v4.1 function newSpec()');
   elCount(); // DUH n=3
   if(n>0) // it starts at 1 anyway
     log("newSpec('n="+n+"')");
   else {
      n = document.n; // for new box
      n++; document.n=n;
     // log("newSpec(n="+n+")");
   }
   if(n>100) { alert("Hit limit in newSpec()"); return 0; }
   //n++;
   var newDiv = $("el1Spec").cloneNode(true);

   newDiv.id=newDiv.id.replace("1",n);
   newDiv.innerHTML=newDiv.innerHTML.split("el1").join("el"+n);
  // log('$("el'+n+'Name").value');
   $("specBoxes").appendChild(newDiv);
   $("el"+n+"Name").value += n;
   $("el"+n+"Spec").style.backgroundColor = "#dddddd";
  // $("el"+(n+1)+"Name").value+=n+1;
  // set values in parent function
}
function invalidate() { // change reader to maroon
   log('v4.2 function invalidate()');
   $("o_id").style.color="#BB0000";
}
function savelink() { // save boxes
   log('v4.1 function savelink()');
   //str=save();
   save(save());
   //t_export();
}
function save(overwrite) { // save data
   log('v4.2 function save()');
//   alert("save() fired"); //illegal after close
// data= "Gen|Elemeent|Size|P1/P2/P3|5400/5200/5500|n1/n2/n3"
// also Gen|Element1|Length,Area|Lengths|||Element2|Element2|Lengths||||
//Gen|EB1|10m|1|TMESH/N12/N12ST+|5500/5400/400|2/2/27|Element2|900|4|N12|300|4
////////////////////////////////////////////////////
// for some reason all of this does nothing
// NOT NOTHING, IT DOES EVERYTHING
   ln=2;
/// use this in save function to re
   if(overwrite) { // save passed string (load)
   // Also accept colour to export, eg "Y"
   // SHOULD SAVE EVERYTHING, ONLY CSV SHOULD CHANGE
      str=overwrite;
      localStorage.data = str;
      return str;
   } else { // normal save, can use the procedure export-import
     data = new Array();
     //c_iList[2]=="Y";c_rgba==rgba(255, 255, 0, 0.5);
     data[0] = "Matrix"+nSave;
     data[1] = $('o_id').value; // save identifier
     n = elCount();
//     document.ln = data.length;
     for(var i=1;i<n+1;i++) {
       // log("Setting "+$("el"+i+"Name").value+" save array");
//        ln =
        data.push($('el'+i+'Name').value);
        data.push($('el'+i+'Length').value);
        data.push($('el'+i+'Lengths').value);
        data.push($('el'+i+'p').value.split("\n").join('/'));
        data.push($('el'+i+'s').value.split("\n").join('/'));
        data.push($('el'+i+'n').value.split("\n").join('/'));
        data.push($('el'+i+'c').value);
        data.push($('el'+i+'l').value);
        c_i = cCode($('el'+i+'Spec').style.backgroundColor);
        data.push(c_i);
        log("L541 c_i:"+c_i); // G, correct
        log("L542 cCode($(...)):"+cCode($('el'+i+'Spec').style.backgroundColor));
     }
     str = data.join("|");//begins with Gen
     $("o_id").style.color="";
     log("Saved "+str);
     return str;
   }//*/
////////////////////////////////////////////////////
// use import export procedure
}
// Colour recognition and coding from header
//c_iList="R,O,Y,G,C,B,M,E";//E for grey
//c_k=[7,2,3,0,5];//kanban colours + extras
//c_rgba="rgba(255, 0, 0, 0.5)/rgba(255, 127, 0, 0.5)/rgba(255, 255, 0, 0.5)/rgba(0, 255, 0, 0.5)/rgba(0, 255, 255, 0.5)/rgba(0, 0, 255, 0.5)/rgba(255, 0, 255, 0.5)/rgba(127, 127, 127, 0.5)";
function cCode(colour) { // returns alpha code from rgbx colour
   log("v4.1 function cCode("+colour+")"); // should be used instead of c_iList.indexOf
   colour = colour.replace("rgba","rgb");
   colour = colour.replace(", 0.5","");// transform
   return c_iList[c_rgb.indexOf(colour)]; // initialC(rgbx) might work better for non-exact match
}
function cValue(cCode) {
   return c_rgba[c_iList.indexOf(cCode)];
}
function showTakeoff() {
   log('v4.1 function showTakeoff()');
   $('d_takeoff').style.display="block";
}
function row_count(text) {
   ar = text.split('\n');
   len = 0;
   for(var i=0; i<ar.length; i++) {
      if(ar[i]=="")
         return i;
   }
   return i;
}
function product_change(el) { // recognise product and set spacing from PRODUCTSIZE Number from el, runs before change()
   log('v4.1 function product_change()');
   product = el.value.split('\n'); // may have blank indices but we won't loop to them
   products = row_count(el.value);
   n_el = readNum(el.id,2,401);
   spacing = $("el"+n_el+"s").value.split('\n');
   spacings = row_count($("el"+n_el+"s").value);
   if(spacings<products) { // need to suggest the length but only if some undefined
      for(var i=spacings; i<products; i++) { // i=spacings:products
         if(product[i]=="") continue; // else suggest length
         sz = product_size(product[i],n_el);
         log([product[i],sz,((sz>0)?sz:"")]);//tmesh 5500
         spacing[i] = ((sz>0)?sz:"");
        // log(["L196 spacing:",spacing]); /// 5500!!!
         // the problem MUST be that spacing is blank... nothing to divide? We are trying to access indices beyond range
         // but they ARE allowed to be set!
      }
      $("el"+n_el+"s").value = spacing.join('\n');
   }
   change(); // in case modifiers changed
}
/*function product_size(product, el) { // suggest length or -1
   /*if(product[3]) { if(product[3].toUpperCase()=="S") { // I HAVE THE FIRST PART OF THE CODE I NEED TO USE DETAILED LAPS
   log('v4.1 function product_size()');  //}} fudge
      product = product.split("S");
      size = product[1]*1000;
      product = product[0];
      laps = $("el"+el+"l").value.split(" ");
      iLap=-1;
      for(j=0; j<laps.length; j++)//*//*

         for(var i=0; i<PRODUCTSIZE.length; i++) {
            if(product.indexOf(PRODUCTSIZE[i][0])>-1)
               return PRODUCTSIZE[i][1];
         }
         return -1; // it wasn't found
}  fudge }}*/
// From 1324b ->
function product_size(product, el) { // suggest length or -1
   if(product[3]) { if(product[3].toUpperCase()=="S") {
      product = product.split("S");
      size = product[1]*1000;
      product = product[0];
      laps = $("el"+el+"l").value.split(" ");
      iLap=-1;
      for(j=0; j<laps.length; j++) {
         laps[j]=laps[j].split(":");
         if(product==laps[j][0]) {
            iLap = j;// log(product);
         }
      }
      if(iLap>-1)
         return size-Number(laps[iLap][1]);
   }// if it's not stock bar, might be a U bar
      // but this is handled in the same way as a lig
      // product == "N10" with no S TODO
   }
   for(var i=0; i<PRODUCTSIZE.length; i++) {
      if(product.indexOf(PRODUCTSIZE[i][0])>-1)
         return PRODUCTSIZE[i][1];
   }
   return -1; // it wasn't found
}
function change(el) { // recalculate Number from el
   if(el) {
   log('v4.1 function change()');
   invalidate();
      n = readNum(el.id,2,445); log("CHANGED n:"+n);
      log('El '+n+' products: '+$("el"+n+"p").value.split("\n").length);
      //*IF ERRORS OCCUR*log('$("el'+n+'Length").value');
      mmLength = $("el"+n+"Length").value;// log("220|mmLength:"+mmLength);
// could it really have not recognised "m" line 504
//      if(mmLength[mmLength-1]=="m")
//         mmLength = 1000*mmLength.substring(0,mmLength.length-2);
      //NEW PROCESS
      var spacing = $('el'+(n)+'s').value.split("\n");
     // log(spacing.join("/"));
      //$("el1n").value = n.join("\n") // WHAT?! <--------------------------
      //*IF ERRORS OCCUR*output=[""+mmLength];
      // DETECT MAX DEFINED ROWS STARTING AT 0
      //log('el'+(n)+'p');
      var products = $('el'+(n)+'p').value;
      n_p = row_count(products);
      products = products.split("\n");
      n_n = row_count($('el'+(n)+'n').value);
      n_s = row_count($('el'+(n)+'s').value);
      old_n = $('el'+(n)+'n').value.split("\n");
      n_out=[...old_n]; // STARTS WITH old_n!!

      mmLl = mmLength.length; // find m, x1000
      lengths = $("el"+n+"Lengths").value;
      if((mmLength[mmLl-1]=="m")&(mmLength[mmLl-2]!="m"))
         mmLength = 1000*eval(mmLength.substring(0,mmLl-1));         //for(var i=0;i<n_s;i++) DON'T KNOW WHY THIS IS HERE
      //output.push(""+mmLength);
      // collapse "20x0.8 to 16"
      for(var i=0; i<n_s; i++) { // counts spacing
/*         if((spacing[i][0]=="[")|(spacing[i][0]=="(")|(spacing[i][0]=="-")) {
            continue; } // loaded number already?*/
         if(spacing[i].indexOf('x')>0)
            spacing[i]=spacing[i].split('x')[0]*spacing[i].split('x')[1];
      }
      $('el'+(n)+'s').value = spacing.join('\n');

      for(var i=0; i<n_s; i++) {// need to check spacing exists
         if((i>=n_p)|(mmLength==0)) {
            n_out[i] = "-"; // not defined
            continue; }
         if(!(spacing[i]>0)) { // spacing NOT DEFINED, only count
            // take no action, leave the number unchanged
            continue; }
         // n=spaces[rounded up]+[extras if +]
         log(mmLength,spacing,i);
         add = 0; // default
         i_p = products[i].indexOf("+");
         if(i_p==products[i].length-1)
            add = Number(lengths);
         else if(i_p>5) {
            right = products[i].split("+")[1];
            add = Number(right); }
         // but if there is an x
         mult=1; // accept a single digit multiplier
         if(products[i].indexOf("x")==products[i].length-2)
            mult = Number(products[i][products[i].length-1]);
         log("["+spacing[i]+"]");
         if(spacing[i]=="-") {
            log("'-' found, returning "+old_n[i]);
            n_out[i] = old_n[i];
         } else {
            n_out[i]=Math.floor(mmLength/spacing[i]+1); // round up
            n_out[i]+=add; // add number
            n_out[i]*=mult; // multiply ;-)
         }
      }
      // set the box for that element
      $('el'+(n)+'n').value = n_out.join("\n");
   } else {
      for(var n=1; n<=document.n; n++) { // cycle through all specs
         change($("el"+n+"n"));
   } }
}
function elCount() {
   log('v4.1 function elCount()');
   var n=0;
   while($('el'+(n+1)+'Name'))
      n++;
   document.n=n;
   return n;
}
function isNum(a) {
   log('v4.1 function isNum()');
 /*a=a.split("\n").join(""); */
 log("isNum a.length: "+a.length);
 return a==Number(a)+""; }
function checkUnique(id_el) { // checks identifier is not repeated
   var repeated = false;
   for(var i=1;i<=document.n;i++) {
   log('v4.1 function checkUnique()');
      if(i==readNum(id_el.id,2,461))
         continue; // skip checking against itself
   }
}
/*function readNum(str, start=0, Ltrace) {   // MIGHT NEED THIS
   log('v4.1 function readNum()');
// readNum("asdfasd23452345adgad",10) undefined but gave 2 at 8
   log("readNum("+str+","+start+") Line "+Ltrace);
   var i=start+1; // assume first char is numeric
   var a = str[start];
   for(i=start+1; i<str.length; i++)
   } fudge it closed*/
function readNum(str, start) {
// readNum("asdfasd23452345adgad",10) undefined but gave 2 at 8
   var i=start+1; // assum first char is numeric
   while(isNum(str[i]))
      i++;
   return Number(str.substring(start,i));
}
function t_import(button) { // Make sure it doesn't get recursive??
   str = prompt("Paste data to import");
   if(str) {
   log('v4.1 function t_import()');
   save(str);
   window.location=window.location; }
}
function t_export(button) {
   log('v4.1 function t_export()');
   str=save();
   prompt("Send this data to another computer",str);
}
function reset() {
   log('v4.1 function reset()');
   if(confirm("Really reset?")) {
      save(" ");
      window.location=window.location;
} }
function ear(barSz) {
   log(barSz+" ear size returned 11d");
   if(barSz.length>2)
      barSz = barSz.substring(1,3); //bar size
   return 11*eval(barSz);
}
// FORMAT
// Element  Element Description  Mult  Product  Notes Qty   Unit  Mark  Shape A  B  C  D  E  F  G  H  J  K  O  R  Length   Wt
function CSV() { // show generated CSV
   //alert(n_el==document.n); true
   $('dl').style.display="block";
   $('filename').value=$('el1Name').value+((n_el==1)?"":('-'+$("el"+n_el+"Name").value))+".csv";

   var n=1;
   const dummy = '"Element","Element Description", Mult, Product,"Notes", Qty, Unit, Mark, Shape,!A,!B';//,"!C","!D","!E","!F","!G","!H","!J","!K","!O","!R'
   ar = [dummy.replaceAll("!","")]; // NEEDS HEADER ROW
   while($("el"+n+"Name")) { // loop n elements and i lines each
      lines = $("el"+n+"p").value.split('\n');
//      log(["lines["+n+"].length:",lines.length]);
      number = $("el"+n+"n").value.split('\n');
      for(var i=0;i<lines.length;i++) {
         if(lines[i]=="") continue;
         NAME=$("el"+n+"Name").value;
         str=dummy.replace("Element Description",NAME);
         str=str.replace("Element",((n<10)?"0":"")+n);
         str=str.replace("Mult","1");
         tail = lines[i].substring(lines[i].length-6);
         product = lines[i].split("+")[0].split("x")[0];
         // it gets confused if there is only a lig
         // or now a U bar too!
         //str=str.replace("Product",product); // remove modifiers
         log("Product: "+lines[i]+", MESH? "+((lines[i].indexOf("MESH")==-1)?false:true));//N10U[400x400]:lines[i]
         str=str.replace("Notes",$("el"+n+"Name").value+"-"+lines[i]);//notes is good
//         str=str.replace("NOTE2","Gen");
         str=str.replace('Qty, Unit',number[i]+', '+((lines[i].indexOf("MESH")==-1)?'Pcs':'Sheets'));
         mark=(i+1)+NAME.substring(0,((i>9)?3:4))+product.substring(0,3);
         mark=mark.toUpperCase();
         size=lines[i].substring(4,lines[i].length-1);
         log("size:"+size);
         if(lines[i].length-lines[i].indexOf("ST")<4) {
           // log('lines[i].length-lines[i].indexOf("ST")<4');
            str=str.replace("Shape","102");
            str=str.replace("!A","200");
            str=str.replace("!B","1000");
            product=lines[i].split("ST")[0]; }
         else {
            if(product[3]=="(") { // LIG OR STRAIGHT, NO COVER
               product = product.split("(")[0];
//              // log("Product="+product);//"N10" GOOD!!!
               if(size.indexOf('x')>0) { // lig
                  str=str.replace("Shape","301");
                  log("Shape 301 with N10 only");
                  //nuevo = ALPHA_AR.splice(2); //C,D..H
                  x=Number(size.split("x")[0]);
                  y=Number(size.split("x")[1]);
                  //product = product.split("(")[0];

                  str=str.replace("!A","130");
                  str=str.replace("!B",x+","+y+","+x+","+y+","+130+","+75);
               } else { // straight
                  str=str.replace("Shape","S");
                  str=str.replace("!A","");
                  str=str.replace("!B",size);
               }
            } else if(product[3]=="[") { // & (product[3]!="(")
               //product = product.split("[");}
               // NOT YET!
            } else if(product.substring(3,5)=="U(") { // & (product[3]!="(")
               log(product); // lines[i] with + and x cut off!
               product = lines[i].split("U(");
               size = product[1].split("x");
               product=product[0];
               log(size);//['300','400)']
               size[1]=size[1].substring(0,size[1].length-1);
               str=str.replace("Shape","117");
               str=str.replace("!A","");
// THE SECOND VERTICAL LEG IS ALL THE WAY DOWN AT "G"!!!
// USE SHAPE 117(B,C,D) INSTEAD OF 102
               str=str.replace("!B",size[1]+","+size[0]+","+size[1]);
               mark=product+"U"+(i+1)+NAME.substring(0,((i>9)?2:3));;
            }
            else {
               str=str.replace("Shape","");
               str=str.replace("!A","");
               str=str.replace("!B","");} }
//         if( // IF WHAT?!
         log("Product="+product);//"N10U"!!!!
         if(str[str.length-1]=="U") // lose te U
            str=str.substring(0,str.length-2);
         str=str.replace("Product",product); // remove modifiers
         str=str.replace("Mark",mark.toUpperCase())
         str.replaceAll("!","");// DIFFERS FROM replace()
         ar.push(str);
      } n++; // continue loop until one more spec complete
   }
   //ar.unshift(dummy);
   $("CSV").value=ar.join('\n');
}
function OLDCSV(colourflag="") { // show generated CSV - THIS DOESNT WORK BUT DOES GIVE DUMMY ELEMENT
   //alert(n_el==document.n); true
   /*if(confirm("Export only yellow elements?"))
      colourflag="Y";*/
   log("Partial CSV code not complete");
   log("CSV colour: "+colourflag);
   $('dl').style.display="block";
   $('filename').value=$('el1Name').value+((n_el==1)?"":('-'+$("el"+n_el+"Name").value))+".csv";
   colour = c_rgba.indexOf(colour);

   var n=0;// need to correct indexes
   const dummy = '"Element","Element Description", Mult, Product,"Notes", Qty, Unit, Mark, Shape,!A,!B';//,"!C","!D","!E","!F","!G","!H","!J","!K","!O","!R'
   ar = [dummy.replaceAll("!","")]; // NEEDS HEADER ROW
   bExport = true;
   while($("el"+(n+1)+"Name")) { // loop n elements and i lines each
      n++;
      log("CSV element "+n);
      NAME = $("el"+(n)+"Name").value;
      //if(colourflag) bExport = false; // CSV only one colour
      lines = $("el"+n+"p").value.split('\n');
//      if(colour!=$('el'+n+'Spec').style.backgroundColor)
//         continue; //ONLY COLOURFLAG
//      log(["lines["+n+"].length:",lines.length]);
      number = $("el"+n+"n").value.split('\n');
      if($("el"+n+"p").value=="") { // If there's a blank element, insert placeholder
         str=dummy.replace("Element Description",NAME);
         str=str.replace("Element",((n<10)?"0":"")+n);
         str=str.replace("Mult","1");
         str = str.replace("Product","COMMENTS");
         str = str.replace("Notes","-dummy line for deletion-");
         str = str.replace("Qty",1);
         str = str.replace("Unit, Mark, Shape,!A,!B","Pcs");

         ar.push(str);
         continue; // after giving the comment
      }
      for(var i=0;i<lines.length;i++) {
         log("Line "+i);
         /*DUMMY = false;
         if(lines[i]=="") { DUMMY = true; }*/
         log("CSV(Element "+n+", line "+i+")");
         bExport = true; // export flag for each element
         NAME=$("el"+n+"Name").value;
         str=dummy.replace("Element Description",NAME);
         str=str.replace("Element",((n<10)?"0":"")+n);
         str=str.replace("Mult","1");
         // why did I want the last 6 characters?
         tail = lines[i].substring(lines[i].length-6);
         product = lines[i].split("+")[0].split("x")[0];
         // it gets confused if there is only a lig
         // or now a U bar too!
         //str=str.replace("Product",product); // remove modifiers
         log("Product: "+lines[i]+", MESH? "+((lines[i].indexOf("MESH")==-1)?false:true));//N10U[400x400]:lines[i]
         //str=str.replace("Notes",COMMENT[n-1][i]);//notes is good
         str=str.replace("Notes","");//leave blank for now
//         str=str.replace("NOTE2","Gen");
         str=str.replace('Qty, Unit',number[i]+', '+((lines[i].indexOf("MESH")==-1)?'Pcs':'Sheets'));
         // ALLOW TEN CHARS
         mark=i+NAME.substring(0,((i>8)?5:6))+product.substring(0,3);
         mark=mark.toUpperCase();
         size=lines[i].substring(4,lines[i].length-1);
         log("size:"+size);
         if(lines[i].length-lines[i].indexOf("ST")<4)
         {
            log('lines[i].length-lines[i].indexOf("ST")<4');
            str=str.replace("Shape","102");
            str=str.replace("!A","200");
            str=str.replace("!B","1000");
            product=lines[i].split("ST")[0]; }
         else { // EVERYTHING that isn't a starter?!
            if(product[3]=="(") { // LIG OR STRAIGHT, NO COVER
               product = product.split("(")[0];
//              // log("Product="+product);//"N10" GOOD!!!
               if(size.indexOf('x')>0) { // lig
                  str=str.replace("Shape","301");
                  log("Shape 301 with N10 only");
                  //nuevo = ALPHA_AR.splice(2); //C,D..H
                  x=Number(size.split("x")[0]);
                  y=Number(size.split("x")[1]);
                  //product = product.split("(")[0];

                  str=str.replace("!A","130");
                  str=str.replace("!B",x+","+y+","+x+","+y+","+130+","+75);
               } else { // straight
                  str=str.replace("Shape","S");
                  str=str.replace("!A","");
                  str=str.replace("!B",size);
               }
            } else if(product[3]=="[") { // & (product[3]!="(")
               //product = product.split("[");}
               // NOT YET!
            } else if(product.substring(3,5)=="U(") { // & (product[3]!="(")
               log(product); // lines[i] with + and x cut off!
               product = lines[i].split("U(");
               size = product[1].split("x");
               product=product[0];
               log(size);//['300','400)']
               size[1]=size[1].substring(0,size[1].length-1);
               str=str.replace("Shape","117");
               str=str.replace("!A","");
// THE SECOND VERTICAL LEG IS ALL THE WAY DOWN AT "G"!!!
// USE SHAPE 117(B,C,D) INSTEAD OF 102
               str=str.replace("!B",size[1]+","+size[0]+","+size[1]);
               mark=product+"U"+i+NAME.substring(0,((i>9)?2:3));;
            }
            else {
               product = lines[i].split("+")[0].split("x")[0]; // wasn't this already here? Maybe not for products
               str=str.replace("Shape","");
               str=str.replace("!A","");
               str=str.replace("!B","");} }
//         if( // IF WHAT?!
         log("Product="+product);//"N10U"!!!!
         if(str[str.length-1]=="U") // lose te U
            str=str.substring(0,str.length-2);
         str=str.replace("Product",product); // remove modifiers
         str=str.replace("Mark",mark.toUpperCase())
         str.replaceAll("!","");// DIFFERS FROM replace()
         ar.push(str);
         log("CSV:"+str);
      }; // continue loop until one more spec complete
   }
   //ar.unshift(dummy);
   $("CSV").value=ar.join('\n');
}
function lig(mark, bar, qty, w, h) {
   log('v4.1 function lig()');
   alert("Blank lig() called");
}
function dCSV() {
   log('v4.1 function dCSV()');
   if(confirm("After CSV import, each line will require WBS setting if elements not previously defined"))
      download($('filename').value,$("CSV").value);
}
function dTXT() {
   log('v4.1 function dTXT() v3.1');
   var file = [txtHeader];
   file.push($('takeoff').value);
   file.push("]-[\n");
   download($('filename2').value,file.join("\n")+save());
}
function txtLoad() {
   if($("takeoff").value.indexOf("\n]-[\n")==-1) {
      alert("Invalid text save data found");
      return;
   }
   txt = $("takeoff").value.split("\n]-[\n");
   $("takeoff").value = txt[0];
   save(txt[1]);
   load();
}
