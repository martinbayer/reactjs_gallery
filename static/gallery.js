var SELECTION_PART_HEIGHT = 150;
/* let the image to have at least 10px empty space around */
var ACTIVE_IMAGE_MARGIN = 10;

var LEFT_ARROW_KEY_CODE = 37;

var RIGHT_ARROW_KEY_CODE = 39;

function ImageInformation(x, y, width, height){
	this.x = x + ACTIVE_IMAGE_MARGIN;
	this.y = y + ACTIVE_IMAGE_MARGIN;
	this.width = width;
	this.height = height;
}

var ImageClass = React.createClass({
	render: function(){
		
	}
});
var win = $(window);
var doc = $(document);
var EmptySpan = React.createClass({
	render: function(){
		return React.createElement('span');
	}
});

var MoveButton = React.createClass({
	render: function(){
		var emptySpan = React.createElement(EmptySpan);
		return React.createElement('p',{className: 'moveButton '+this.props.classNames, onClick: this.props.onClick}, emptySpan);
	}
});
 
var ImagesCreator = React.createClass({
	getInitialState: function(){
		var windowSize = [];
		var photographsPaths = [];
		
		/* let the complete image path to be key to cache the ImageInformation for each image (initialized when activated) */
		var imagesInformation = [];
		
		/*
		 * let the window size to be 0x0 before the component is mounted. Then
		 * set the proper value in componentDidMount method and listen for
		 * window size changes
		 */
		windowSize["width"] = 0;
		windowSize["height"] = 0;
		
		var activeImageIdx = 0;
		return {
			/* window size available to show the image */
			windowSize: windowSize, 
			/* currently selected image */
			activeIdx: activeImageIdx,
			/* only initialization of the state's property holding the paths for the photographs */
			photographsPaths:photographsPaths,
			/* size and position information for the image */
			imagesInformation: imagesInformation
		};
		
	},
	
	/* call this method when the component is mounted and on every window's size change */
	updateWindowSize: function(){
		this.state.windowSize["width"] = win.width();
		this.state.windowSize["height"] = win.height();
		this.state.imagesInformation = [];
		this.setState(this.state);
	},
	
	componentDidMount: function(){
		var that = this;
		/* initialize windowSize property in updateWindowSize method when the component is mounted */
		that.updateWindowSize();
		win.on('resize', function(){
			that.updateWindowSize();
		});

		/* initialize left and right arrow keys to preview the photographs */
		doc.keydown(function(event){
			switch(event.keyCode){
				/* keyCode for left arrow = 37 */
				case LEFT_ARROW_KEY_CODE:
					that.showPrevious();
					break;
				/* keyCode for right arrow = 39 */
				case RIGHT_ARROW_KEY_CODE:
					that.showNext();
					break;
			}
		});
	},

    componentWillUnmount: function() {
    	win.off('resize');
    },
	
	constructImagesPaths: function(folder, imagesNames){
		var paths = [];
		for ( var imageName in imagesNames) {
			paths.push(folder + "/" + imagesNames[imageName]);
		}
		return paths
	},
	
	showPrevious: function(){
		var currentIdx = this.state.activeIdx;
		var photosCount = this.state.photographsPaths.length;
		if(photosCount>1){
			var newIdx = currentIdx-1<0?photosCount-1:currentIdx-1;
			this.handleNewIdx(newIdx);
		}else{
			/* do not move anywhere if there is only one photograph */
		}
	},
	
	showNext: function(){
		var currentIdx = this.state.activeIdx;
		var photosCount = this.state.photographsPaths.length;
		if(photosCount>1){
			var newIdx = currentIdx+1>photosCount-1?0:currentIdx+1;
			this.handleNewIdx(newIdx);
		}else{
			/* do not move anywhere if there is only one photograph */
		}
	},

	
	selectImage: function(newIdx){
		this.state.activeIdx = newIdx;
		this.setState(this.state);
	},
	
	handleNewIdx: function(newIdx){
		/* set the new idx as the one of the state properties */
		this.state.activeIdx = newIdx;
		this.setState(this.state);
	},
	
	render: function(){
		var that = this;
		var data = this.props.data;
		var title = data["title"];
		var folder = data["folder"];
		var names = data["photonames"];
		this.state.photographsPaths = this.constructImagesPaths(folder, names);
		/* works as check to not to set more active images */
		var activeAlreadySelected = false;
		var photographsPaths = this.state.photographsPaths;
		/*
		 * Object.keys(array).map will run the function on one values: index of
		 * the value in the array..e.g. "0"...then "1", "2", "3"...
		 */
		var images = Object.keys(photographsPaths).map(function(index){
			var src = photographsPaths[index];
			var active='';
			if(that.state.activeIdx == index && !activeAlreadySelected){
				active = 'active';
				activeAlreadySelected = true;
			}
			return React.createElement('img',{key: src, src:src, className:'galleryImage '+active});
		});

		var MoveLeftInstance = React.createElement(MoveButton, {onClick: that.showPrevious, classNames: 'left'});
		var MoveRightInstance = React.createElement(MoveButton, {onClick: that.showNext, classNames: 'right'});
		var ImagePickerInstance = React.createElement(ImagePicker,{selectImage: that.selectImage, photographsPaths:photographsPaths, activeIdx: that.state.activeIdx});
		return React.createElement('div',{className: 'fullsize'}, images, MoveLeftInstance, MoveRightInstance, ImagePickerInstance);
	}

});

var ImagePicker = React.createClass({
	render: function(){
		var that = this;
		var images = Object.keys(that.props.photographsPaths).map(function(index){
			var src = that.props.photographsPaths[index];
			var notActive = (index==that.props.activeIdx)?'':'desaturate';
			var imagePicker = React.createElement('img',{key: src, src:src, onClick: that.selectImage.bind(that,index)});
			return React.createElement('li',{key: src, className: 'image '+notActive},imagePicker);
		});

		/* set the position of the list of the image to be selected */
		var leftMove = -that.props.activeIdx*200;

		var ulStyle = {
			marginLeft: leftMove	
		};
		var ulNode = React.createElement('ul',{style: ulStyle, className: 'imageList'},images);
		return React.createElement('div',{className: 'imagepicker'},ulNode);
	},

	selectImage: function(newIdx){
		this.props.selectImage(newIdx)
	}
});

var data={
          "title": "Testing gallery", "folder": "static/galleries", "photonames": ["waterfall.jpg","tiger.jpg","green.jpg","fruit.jpg","falcon.jpg","chajda.jpg","blossom.jpg","photograph.jpg","oldpeople.jpg"]};
React.render(React.createElement(ImagesCreator,{data: data},"hello"),document.getElementById('gallery'));