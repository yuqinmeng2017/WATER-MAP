
var mapCenter = [75.81246, 26.91978];
var mapZoom = 11;


mapboxgl.accessToken = 'pk.eyJ1IjoieXVxaW5tZW5nMjAxNyIsImEiOiJjamc4ZnBpdjcxMDRmMnhxbDN0bHRiamNpIn0.8dW5tp4Ek1dn7GJvSchfqg'; 
var map = new mapboxgl.Map({
	container: 'map',   
	style: 'mapbox://styles/yuqinmeng2017/ck3qogiu67pj61coaclsbetmo',

});

    $("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
        $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
        $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
    });

    $(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
        $("#screen").fadeToggle();
        $(".modal").fadeToggle();
    });


// See example tutorial at https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/#create-arrays-of-intervals-and-colors

  map.on('load', function() {
  	
  var layers = [ // an array of the possible values you want to show in your legend
        'Pumping stations', // Civic Spaces.png
        'STP', // Community Park.png
        'Water storage tank', // Neighborhood Park.png
    ];

    var colors = [ // an array of the color values for each legend item
        '#f7a6db',
        '#f27373',
        '#f3afcd',
        
    ];

     for (i=0; i<layers.length; i++) {
        var layer =layers[i]; // name of the current legend item, from the layers array
        var color =colors[i]; // color value of the current legend item, from the colors array 
        
        var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added

        var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
        var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
        legendKey.css("background", color); // change the background color of the legend key
    }

});

  // --------------------------------------------------------




// -------------------------------------------------------- 
// 5. Popups
// See tutorial at https://docs.mapbox.com/help/tutorials/add-points-pt-3/
// See example of popups on click at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/ 
// See example of popups on hover at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stp = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['stp']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stp.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stp[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h4>STP name: ' + stp[0].properties.Name + '</h4>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// -------------------------------------------------------- 
// 6. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['water-storage-tank', 'Water storage tank'],
        ['water-tranfer-pipeline', 'Water transfer pipeline'],                      // layers[0]
                                                                 // layers[1][1] = 'Parks'
        ['pumping-stations', 'Pumping stations'],     
        ['stp', 'STP'],
        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });

// -------------------------------------------------------- 
// 7. Change a layer's style(maybe delete)
// See example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
        '#F9C7BB',
        '#6E8F60',
    ]; 

    var layer = 'Public Hospital';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });

// -------------------------------------------------------- 
// 8. Scroll to zoom through sites
// See example at https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'darden-towe': {
            name: "STP(Sewage treatment plant)",
            description: "Using internal mechanisms, a sewage treatment plant works by breaking down solid waste to produce a cleaner, more environmentally friendly effluent. Wastewater and sewage are supplied to the primary tank, where the solids and liquids disperse.",
         
            imagepath: "img/stp.jpg",
            center: [75.83538, 26.94297],
            zoom: 15.03,
            pitch: 46.00,
            bearing: -11.20
        },
        'mcguffey-park': {
            name: "Water tank tower",
            description: "A water tower is an elevated structure supporting a water tank constructed at a height sufficient to pressurize a water distribution system for the distribution of potable water, and to provide emergency storage for fire protection. In some places, the term standpipe is used interchangeably to refer to a water tower.Water towers often operate in conjunction with underground or surface service reservoirs, which store treated water close to where it will be used.",
           
            imagepath: "img/water tower-Rd8dkRnJeDLJAKRXyrsgOqN-680x383.jpg",


            center: [75.79048, 26.93891],
            zoom: 14.16,
            pitch: 45.00,
            bearing: -7.61
        },
       
    };

    console.log(chapters['darden-towe']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }
    

// -------------------------------------------------------- 
// 9. Reset map button
    
    $("#reset").click(function() {
        map.setCenter(mapCenter);
        map.setZoom(mapZoom);
        map.setPitch(0);
        map.setBearing(0);
        map.setFilter("clinic", null); // reset building permits filters
        
        // Reset all layers to visible
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

