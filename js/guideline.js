//converters
var mm = 3.779527559; //mm to pixel 
var rad = Math.PI / 180; //degrees to radians
var ang = 180 / Math.PI; //radians to degrees

//preview canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// pre-defined paper sizes
var A4 = {
	width: 297 * mm,
	height: 210 * mm
};

var A3 = {
	width: 420 * mm,
	height: 297 * mm
};

var legal = {
	width: 355.6 * mm,
	height: 215.9 * mm
};

var letter = {
	width: 279.4 * mm,
	height: 215.9 * mm
};

//call main function
main();

function main() {

	//form elements/variables that manipulates the canvas
	var angle = 30;
	var nible_width = 4 * mm;
	var ascender = 3;
	var descender = 2.5;
	var x_height = 3.5;
	var paper = A4;

	$('#angle_box').val(angle);
	$('#nible_width_box').val(nible_width / mm);
	$('#ascender_box').val(ascender);
	$('#descender_box').val(descender);
	$('#x_height_box').val(x_height);
	$('#paper_size_box').val("A4");


	define_callbacks();
	//draw(A4, angle, nible_width, ascender * nible_width, x_height * nible_width, descender * nible_width);

	var ascender_cal = ascender * nible_width;
	var descender_cal = descender * nible_width;
	var x_height_cal = x_height * nible_width; 

	var margin_x = 20 * mm;
	var margin_y = 20 * mm;

	// drawGuidelines(ctx, paper, 0, 50, ascender_cal, x_height_cal, descender_cal);
	// drawAngle(ctx, 0, 50, ascender_cal, x_height_cal, angle, nible_width);
	// drawSquares(ctx, 0, 50, nible_width, x_height_cal, ascender_cal, descender_cal);
	//drawGuidelines(ctx, paper, margin_x, margin_y, ascender, x_height, descender);
  draw(ctx,paper,angle,nible_width,ascender_cal,x_height_cal,descender_cal);
  ctx.strokeRect(0, 0, paper.width, paper.height);

}

function define_callbacks() {

	$(':input').change(function() {

		var angle = $('#angle_box').val();
		var nible_width = $('#nible_width_box').val() * mm;
		var ascender = $('#ascender_box').val();
		var x_height = $('#x_height_box').val();
		var descender = $('#descender_box').val();
		//draw(getPaperSize(), angle, nible_width, ascender * nible_width, x_height * nible_width, descender * nible_width);
		
		var ascender_cal = ascender * nible_width;
		var descender_cal = descender * nible_width;
		var x_height_cal = x_height * nible_width; 

		var paper = getPaperSize();

		ctx.clearRect(0, 0, canvas.width, canvas.height);

    //(ctx, paper, margin_x, margin_y, ascender, x_height, descender)
		draw(ctx,paper,angle,nible_width,ascender_cal,x_height_cal,descender_cal);
    // drawGuidelines(ctx, paper, 0, 50, ascender_cal, x_height_cal, descender_cal);
		// drawAngle(ctx, 0, 50, ascender_cal, x_height_cal, angle, nible_width);
		// drawSquares(ctx, 0, 50, nible_width, x_height_cal, ascender_cal, descender_cal);

	});

  $('#refresh_button').click(function() {
    console.log("worked");
    main();
  });

	$('#print_button').click(function() {

		var angle = $('#angle_box').val();
		var nible_width = $('#nible_width_box').val() * mm;
		var ascender = $('#ascender_box').val();
		var x_height = $('#x_height_box').val();
		var descender = $('#descender_box').val();
		//draw(getPaperSize(), angle, nible_width, ascender * nible_width, x_height * nible_width, descender * nible_width);
		
		var ascender_cal = ascender * nible_width;
		var descender_cal = descender * nible_width;
		var x_height_cal = x_height * nible_width; 

		var paper = getPaperSize();

		var canvas_print = document.getElementById("canvas_print");
		var ctx_print = canvas_print.getContext("2d");

		canvas_print.width = paper.width;
		canvas_print.height = paper.height;// - 30*mm;

 		draw(ctx_print, getPaperSize(), angle, nible_width, ascender_cal, x_height_cal, descender_cal);

 		printCanvas(canvas_print);
	});

}

function getPaperSize() {
    var selection = $('#paper_size_box').val();
    var paper;
    switch (selection) {
      case "A3":
        paper = A3;
        break;
      case "A4":
        paper = A4;
        break;
      case "legal":
        paper = legal;
        break;
      case "letter":
        paper = letter;
        break;
    }
  return paper;
}

function draw(ctx, paper,angle, nible_width, ascender, x_height, descender) {

	//define_callbacks();
  canvas.width = paper.width;
  canvas.height = paper.height;

	//clear canvas before draw again
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//margins and spacing
	var margin_x = 15 * mm;
	var margin_y = 15 * mm;
	var space_between = 10 * mm; //space between ruling lines
	var ruling = ascender + descender + x_height + space_between; //ruling total height size

	//line angle variables
	var nible_angle = -angle * (Math.PI / 180);
	var start_x_angle = margin_x;
	var start_y_angle = margin_y + ascender + x_height;
	var rounded = Math.round(nible_angle * ang); //round the angle numsber, after transform radians to degrees

	//Rect of the paper size
	//ctx.strokeRect(0, 0, paper.width, paper.height);

	//loop to draw the guidelines

	var loop_height = paper.height - margin_y;

	while (loop_height > 0) {

		//guidelines
		drawGuidelines(ctx, paper, margin_x, margin_y, ascender, x_height, descender);

		//nib angle line
		drawAngle(ctx, margin_x, margin_y, ascender, x_height, angle, nible_width);

		//draw squares
		drawSquares(ctx, margin_x, margin_y, nible_width, x_height, ascender, descender);

		//counters and loop stuff
		margin_y = margin_y + space_between + x_height + descender + ascender;
		start_y_angle = margin_y + ascender + x_height;
		loop_height = loop_height - ruling - space_between;
	}
}

function drawGuidelines(ctx, paper, margin_x, margin_y, ascender, x_height, descender) {

  var line_width = (paper.width) - margin_x; //definir paper.width

  //line angle variables
  //var start_x_angle = margin_x;
  //var start_y_angle = margin_y + ascender + x_height;
  //var ruling = ascender + descender + x_height + space_between; //ruling total height size

  console.log("drawGuidelines Start");

  //ascender line
  ctx.beginPath();
  ctx.moveTo(margin_x, margin_y);
  ctx.lineTo(line_width, margin_y);
  ctx.stroke();
  ctx.closePath();

  //x-height line
  ctx.beginPath();
  ctx.moveTo(margin_x, margin_y + ascender);
  ctx.lineTo(line_width, margin_y + ascender);
  ctx.stroke();
  ctx.closePath();

  //baseline
  ctx.beginPath();
  ctx.moveTo(margin_x, margin_y + ascender + x_height);
  ctx.lineTo(line_width, margin_y + ascender + x_height);
  ctx.stroke();
  ctx.closePath();

  //descender line
  ctx.beginPath();
  ctx.moveTo(margin_x, margin_y + ascender + x_height + descender);
  ctx.lineTo(line_width, margin_y + ascender + x_height + descender);
  ctx.stroke();
  ctx.closePath();

}

function drawSquares(ctx, margin_x, margin_y, nible_width, x_height, ascender, descender) {
  var n = ((x_height + ascender + descender) / nible_width)
  var increment = 0;
  n = Math.round(n);
  while (n > 0) {
    ctx.beginPath();
    if ((n % 2) == 0) {
      ctx.rect(margin_x, margin_y + nible_width * increment, nible_width, nible_width);
    } else {
      ctx.rect(margin_x + nible_width, margin_y + nible_width * increment, nible_width, nible_width);
    }

    ctx.fill();
    ctx.closePath();
    increment++
    n--
  }
}

function drawAngle(ctx, margin_x, margin_y,ascender, x_height, angle, nible_width) {
  
  var ascender_height = ascender + x_height;
  var chosen_angle = -(90 - angle) * (Math.PI / 180);
  var cat_opposite = ascender_height + nible_width; // the opposite is defined by the ascender heigth + an small increment, proportional to the nible width
  var cat_adjacent = Math.tan(chosen_angle) * cat_opposite;
  var start_x_angle = margin_x + 2 * nible_width;
  var start_y_angle = margin_y + ascender + x_height;

  //angle line
  ctx.beginPath();
  ctx.moveTo(start_x_angle, start_y_angle);
  ctx.lineTo(-cat_adjacent + start_x_angle, -cat_opposite + start_y_angle);
  ctx.stroke();
  ctx.closePath();

  //draw arc nib angle
  ctx.beginPath();
  ctx.moveTo(start_x_angle, start_y_angle)
  ctx.arc(start_x_angle, start_y_angle, x_height / 2, -(angle * rad), 0);
  ctx.stroke();
  ctx.closePath();

  //show nib degree on canvas
  ctx.font = "15px 'Georgia'";
  ctx.fillText(angle + 'º', -cat_adjacent + start_x_angle, -cat_opposite + start_y_angle - 5);
}

function printCanvas(canvas) {
  //attempt to save base64 string to server using this var
  var dataUrl = canvas.toDataURL();

  var angle = $('#angle_box').val();
  var nible_width = $('#nible_width_box').val();  
  var ascender = $('#ascender_box').val();
  var x_height = $('#x_height_box').val();
  var descender = $('#descender_box').val();

  var windowContent = '<!DOCTYPE html>';

  windowContent += '<html>';
  windowContent += '<head><title>Caligraphy Guideline Maker</title></head>';
  windowContent += '<body>';
  windowContent += '<img src="' + dataUrl + '">';
  windowContent += '<p>Guideline printed on estudioanalogico.com.br/guideline-maker</p>';
  windowContent += '</body>';
  windowContent += '</html>';

  var printWin = window.open('', '');

  printWin.document.open();
  printWin.document.write(windowContent);
  printWin.document.close();
  printWin.focus();
  printWin.print();
  printWin.close();
}