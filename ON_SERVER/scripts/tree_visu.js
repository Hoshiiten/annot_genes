var markRev = {};
var canvas = document.getElementById('fatum-demo');
labelsList={};
T_SIZE = 0.2; //taille du texte des labels

function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [ Math.round(h * 360), Math.round(s * 100),  Math.round(v * 100) ];
}

function hsvToRgb(h, s, v) {
2
    h = h / 360 * 6;
    s = s / 100;
    v = v / 100;

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) , 255];
}

function accept(elem, leaf, intern, parent, depth) {
  if (depth == undefined)
    depth = 0;
  if (elem.children != undefined) {
    if (intern != undefined) intern(elem, parent, depth);
    for (var i in elem.children)
    accept(elem.children[i], leaf, intern, elem, depth + 1);
  }
  else {
   leaf(elem, parent, depth);
  }
}

function changeSize(elem, k) {
  accept(elem, function (elem) {
    elem.size = elem.origin * k;
  });
}


var hstatic = 0;
function changeColor(elem, grey) {
  var f = function () {
  };
  if (grey) {
    f = function (elem) {
      var c = elem.color;
      var y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      elem.markt.color(y, y, y, 255);
    }
  }
  else {
    f = function (elem, parent, depth) {
      if (elem.color == undefined) {
        if (parent == undefined )
          elem.color = [100,100,100,255];
        else {
          var col = parent.color;
          var hsv = rgbToHsv(col[0], col[1], col[2]);
          hsv[1] = 100/(depth+1);
          hsv[2] = 100;
          if (parent.hstatic == undefined)
            parent.hstatic = 0;
          if (parent.hstatic > 360)
            parent.hstatic = 0;
            hsv[0] = parent.hstatic;
            parent.hstatic += 360/ parent.children.length;

          hsv[0] = Math.max(hsv[0], 0);
          hsv[0] = Math.min(hsv[0], 360);
          elem.color= hsvToRgb(hsv[0], hsv[1], hsv[2]);
        }
      }
      if (elem.markt != undefined) {
        elem.markt.color(elem.color);
      }
    };
  }
  accept(elem, f, f, undefined);
}

function recSum(elem) {
  var sum = 0;
  if (elem.children != undefined)
  for (var i in elem.children)
  sum += recSum(elem.children[i]);
   else {
    if (elem.origin == undefined) elem.origin = elem.size;
    return elem.size;
  }
  elem.size = sum;
  return sum;
}


var tmap = function (elem, depth, x0, y0, x1, y1, s) {
  if (elem.markt == undefined) {
    elem.markt = window.fatum.addMark();
    markRev[elem.markt.id()] = elem;
    elem.markt.clippingStart(0).clippingStop(0);
    elem.markt.internalClipping(0);
    elem.markt.shape(Fatum.Shape.SQUARE);
    elem.markt.borderColor(0, 0, 0, 255);
    elem.markt.borderWidth(1);
  }
  var w = (x1 - x0);
  var h = (y1 - y0);
  elem.markt.x((x0 + x1) / 2).y((y0 + y1) / 2);
  elem.markt.width(w).height(h);
  if (w < 0.1 || h < 0.1) {
    elem.markt.borderWidth(1);
    elem.markt.alpha(0);
  }
  else {
    x0 += 0.1;
    x1 -= 0.1;
    y0 += 0.1;
    y1 -= 0.1;
    elem.markt.borderWidth(1);
    elem.markt.alpha(255);
  }
  var dalpha = 0;
  if (s)
    dalpha = (y1 - y0) / elem.size;
  else
    dalpha = (x1 - x0) / elem.size;

	var name;
	var label;
	if (elem.children != undefined)
		for (var i in elem.children) {
			if (s)
				y1 = y0 + elem.children[i].size * dalpha;
			else
				x1 = x0 + elem.children[i].size * dalpha;
	
			tmap(elem.children[i], depth + 1, x0, y0, x1, y1, !s); 
			 if (s)
				y0 = y1;
			else
				x0 = x1;
		}
	else {
		name = elem.name;	
		var r = 0; //rotation du label, par defaut la disposition est orizontale
		var rectCenterX = (x0+x1)/2;
	    var rectCenterY = (y0+y1)/2;	
		
		//Si la chaine entière peut se entrer orizontalement ou verticalement dans le rectangle
		if (w >= (name.length*T_SIZE/2) ||  h >= (name.length*T_SIZE/2) ){
			//Si la chaine peut entrer verticalement seulement
			if (w < (name.length*T_SIZE/2) && h >= (name.length*T_SIZE/2))
				r = 1.57; //rotation de 90° (en radians)
			
			label = window.fatum.addText().textColor(0,0,200,200).size(T_SIZE).text(name).x(rectCenterX).y(rectCenterY).rotation(r); 
			labelsList[name] = label;
		}	
		
		//Autrement : separation de la chaîne de charactères
		else {
			var tmp = name.split(" ");
			for (var i=0; i<tmp.length; i++)
				if (tmp[i].length*T_SIZE/2 > w || tmp[i].length*T_SIZE > h)
					//Si la chaine separée n'entre pas, on ne mets pas le label
					return;
			for (var i=0; i<tmp.length; i++){
				var word = tmp[i];
				label = window.fatum.addText().textColor(0,0,200,200).size(T_SIZE).text(word).x(rectCenterX).y(y1-0.5-i*T_SIZE).rotation(r); 
				labelsList[word] = label;
			}
		}	
	}   
}


function clearLabels(){
	for (var label in labelsList){
		labelsList[label].textColor(0,0,0,0); //rendre le label transparent
		//console.log(labelsList[label]); //test
	}
}

function updateMarks() {
	clearLabels();
	tmap(data, 1, - 8, - 4.75, - 3, 2.5, true);
}


var treeInteractor = function (e) {
  var rect = canvas.getBoundingClientRect();  
  var pickX = e.clientX - rect.left;
  //console.log("canvas top, bottom, left, right "+rect.top+" "+rect.bottom+" "+ rect.left+" "+rect.right);
  //var pickY = canvas.height - e.clientY + rect.top;
  var pickY = e.clientY - rect.top;
  //console.log("x, y choisis "+e.clientX+" "+e.clientY);
  //console.log(pickX+" "+pickY);
  var m = window.fatum.pick(pickX, pickY);
  if(!m) return;
  changeSize(data, 1); // s * k = G / 2
  recSum(data);
  changeColor(data, true);
  changeColor(markRev[m.id()], false);
  changeSize(markRev[m.id()], data.size / (markRev[m.id()].size * 2));
  recSum(data);
  updateMarks();
  window.fatum.animate(500);
}

var initVis = function () {
  window.fatum = Fatum.createFatumContext(canvas);
  Fatum.setRenderingObserver(fatum);
  canvas.onclick = treeInteractor;
  fatum.layerOn(Fatum.MARKS | Fatum.TEXT);
  recSum(data);
  updateMarks();
  changeColor(data, false);
  fatum.swap();
  fatum.center();
  fatum.camera().swap();
};

Fatum.addInitListener(initVis);