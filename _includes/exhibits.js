const flatten = function(items) {
  return items.reduce(function(flat, item) {
    return flat.concat(item);
  });
};

const round4 = function(n) {
  const N = Math.pow(10, 4);
  return Math.round(n * N) / N;
};
const show5 = function(n) {
  return ('' + n).slice(0, 5);
};

const modulo = function(i, n) {
  return ((i % n) + n) % n;
};

const remove_undefined = function(o) {
  Object.keys(o).forEach(k => {
    o[k] == undefined && delete o[k]
  });
  return o;
};

const encode = function(txt) {
  return btoa(encodeURIComponent(txt));
};

const decode = function(txt) {
  try {
    return decodeURIComponent(atob(txt));
  }
  catch (e) {
    return '';
  }
};

const arrayEqual = function(a, b) {
  if (a.length != b.length) {
    return false;
  }
  var pairs = [];
  for (var i = 0; i < a.length; i++) {
    pairs.push([a[i], b[i]]);
  }
  return pairs.every(function(p) {
    return p[0] == p[1];
  });
};

const dFromWaypoint = function(waypoint) {
  return encode(waypoint.Description);
};

const nFromWaypoint = function(waypoint) {
  return encode(waypoint.Name);
};

const mFromWaypoint = function(waypoint, masks) {
  const mask_name = waypoint.Mask;
  return [index_name(masks, mask_name)];
};

const aFromWaypoint = function(waypoint, masks) {
  const arrow = waypoint.Arrow;
  if (arrow) {
    return arrow
  }
  return [-100, -100];
};

const gFromWaypoint = function(waypoint, cgs) {
  const cg_name = waypoint.Group;
  return index_name(cgs, cg_name);
};

const vFromWaypoint = function(waypoint) {
  return [
    waypoint.Zoom,
    waypoint.Pan[0],
    waypoint.Pan[1],
  ];
};

const pFromWaypoint = function(waypoint) {
  const p = waypoint.Polygon;
  return p? p: toPolygonURL([]);
};

const oFromWaypoint = function(waypoint) {
  return [
    waypoint.Overlay.x,
    waypoint.Overlay.y,
    waypoint.Overlay.width,
    waypoint.Overlay.height,
  ];
};

const clearChildren = function(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const parseForm = function(elem) {
  const formArray = $(elem).serializeArray();
  return formArray.reduce(function(d, i) {
    d[i.name] = i.value;
    return d;
  }, {});
};

const classOrNot = function(selector, condition, cls) {
  if (condition) {
    return $(selector).addClass(cls);
  }
  return $(selector).removeClass(cls);
};

const displayOrNot = function(selector, condition) {
  classOrNot(selector, !condition, 'd-none');
};

const activeOrNot = function(selector, condition) {
  classOrNot(selector, condition, 'active');
};

const greenOrWhite = function(selector, condition) {
  classOrNot(selector, condition, 'green');
  classOrNot(selector, !condition, 'white');
};

const toggleCursor = function(cursor, condition) {
  if (condition) {
    $('#openseadragon1 *').css('cursor', cursor);
  }
  else {
    $('#openseadragon1 *').css('cursor', 'default');
  }
};

var toPolygonURL = function(polygon){
    pointString='';
    polygon.forEach(function(d){
        pointString += d.x.toFixed(5) + "," + d.y.toFixed(5) + ",";
    })
    pointString = pointString.slice(0, -1); //removes "," at the end
    var result =  LZString.compressToEncodedURIComponent(pointString);
    return result;
}

var fromPolygonURL = function(polygonString){
    var decompressed = LZString.decompressFromEncodedURIComponent(polygonString);
    if (!decompressed){
      return [];
    }

    var xArray = [], yArray = [];

    //get all values out of the string
    decompressed.split(',').forEach(function(d,i){
        if (i % 2 == 0){ xArray.push(parseFloat(d)); }
        else{ yArray.push(parseFloat(d)); }
    });

    //recreate polygon data structure
    var newPolygon = [];
    if (xArray.length == yArray.length) {
      xArray.forEach(function(d, i){
          newPolygon.push({x: d, y: yArray[i]});
      });
    }
    return newPolygon;
}

var lasso_draw_counter = 0;
var lasso_draw = function(event){

    lasso_draw_counter ++;
    if (lasso_draw_counter % 5 != 1) {
      return  
    }

    viewer = this.viewer;

    //add points to polygon and (re)draw
    var webPoint = event.position;
    var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
    this.state.p.push({"x":viewportPoint.x,"y":viewportPoint.y});

    this.newView(false);
}

const download = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const ctrlC = function(str) {
  Clipboard.copy(str);
};

const newMarkers = function(tileSources, group, active_masks) {

	const mask_paths = active_masks.map(m => m.Path);
	
  Object.keys(tileSources)
    .forEach(el => {
      el === group.Path || mask_paths.includes(el)
        ? tileSources[el].forEach(t => t.setOpacity(1))
        : tileSources[el].forEach(t => t.setOpacity(0));
    })
};

const unpackGrid = function(layout, images, key) {
  const image_map = images.reduce(function(o, i) {

    i.TileSize = i.TileSize || [1024, 1024];
    i.maxLevel = i.maxLevel || 0;

    // Add to dictionary by Name
    o[i.Name] = i;

    return o;
  }, {});

  return layout[key].map(function(row) {
    return row.map(function(image_name) {
      return this.image_map[image_name];
    }, {image_map: image_map});
  }, {image_map: image_map});
};

const deepCopy = function(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === 'object') ? deepCopy(v) : v;
  }
  return output;
};

const serialize = function(keys, state, delimit) {
  return keys.reduce(function(h, k) {
    var value = state[k] || 0;
    // Array separated by underscore
    if (value.constructor === Array) {
      value = value.join('_');
    }
    return h + delimit + k + '=' + value;
  }, '').slice(1);

};

const deserialize = function(entries) {
  const query = entries.reduce(function(o, entry) {
    if (entry) {
      const kv = entry.split('=');
      const val = kv.slice(1).join('=') || '1';
      const vals = val.split('_');
      const key = kv[0];
      // Handle arrays or scalars
      o[key] = vals.length > 1? vals: val;
    }
    return o;
  }, {});

  return query;
};

const newCopyYamlButton = function(THIS) {
  const copy_pre = 'Copy to Clipboard';
  const copy_post = 'Copied';
  $(this).tooltip({
    title: copy_pre
  });

  $(this).on('relabel', function(event, message) {
    $(this).attr('data-original-title', message).tooltip('show');
  });

  $(this).click(function() {
    $(this).trigger('relabel', [copy_post]);
    ctrlC(THIS.bufferYaml);
    setTimeout((function() {
      $(this).trigger('relabel', [copy_pre]);
    }).bind(this), 1000);
    return false;
  });
};

const newCopyButton = function() {
  const copy_pre = 'Copy to Clipboard';
  const copy_post = 'Copied';
  $(this).tooltip({
    title: copy_pre
  });

  $(this).on('relabel', function(event, message) {
    $(this).attr('data-original-title', message).tooltip('show');
  });

  $(this).on('click', function() {
    const form = $(this).closest('form');
    const formData = parseForm(form);
    $(this).trigger('relabel', [copy_post]);
    ctrlC(formData.copy_content);
    setTimeout(function() {
      $(this).trigger('relabel', [copy_pre]);
    }, 1000);
  return false;
  });
};

const changeSprings = function(viewer, seconds, stiffness) {
  const springs = [
    'centerSpringX', 'centerSpringY', 'zoomSpring'
  ];
  springs.forEach(function(spring) {
    const s = viewer.viewport[spring];
    s.animationTime = seconds;
    s.springStiffness = stiffness;
    s.springTo(s.target.value);
  });
};

const HashState = function(viewer, tileSources, exhibit, options) {

  this.trackers = [];
  this.embedded = options.embedded || false;
  this.showdown = new showdown.Converter();
  this.tileSources = tileSources;
  this.exhibit = exhibit;
  this.viewer = viewer;
  this.svg_overlay = d3.select(viewer.svgOverlay().node());

  viewer.setVisible(false);

  this.state = {
    buffer: {
      waypoint: undefined
    },
    drawType: "lasso",
    changed: false,
    design: {},
    m: [-1],
    w: [0],
    g: 0,
    s: 0,
    a: [-100, -100],
    v: [0.5, 0.5, 0.5],
    o: [-100, -100, 1, 1],
    p: [],
    name: '',
    description: '',
    mouseEvent: {},
    edit: false,
    drawing: 0,
    editing: 0
  };

  this.newExhibit();
};

HashState.prototype = {

  init: function() {
    // Read hash
    window.onpopstate = this.popState.bind(this);
    window.onpopstate();
		if (this.edit) {
    	this.startEditing();
		}
    this.pushState();

    // Edit name
    $('#exhibit-name').text(this.exhibit.Name);

    $('.modal_copy_button').each(newCopyButton);

    $('#zoom-in').tooltip({
      title: 'Zoom in'
    });
    $('#zoom-out').tooltip({
      title: 'Zoom out'
    });
    $('#zoom-home').tooltip({
      title: 'Reset Zoom'
    });
    $('#arrow-switch').tooltip({
      title: 'Share Arrow'
    });
    $('#lasso-switch').tooltip({
      title: 'Share Region'
    });
    $('#draw-switch').tooltip({
      title: 'Share Box'
    });
    $('#duplicate-view').tooltip({
      title: 'Clone linked view'
    });

    $('#copy_link_modal').on('hidden.bs.modal', this.cancelDrawing.bind(this));
    $('#edit_description_modal').on('hidden.bs.modal', this.cancelDrawing.bind(this));

    $('#toggle-sidebar').click(function(e) {
      e.preventDefault();
      $("#sidebar-menu").toggleClass("toggled");
    });

    $('#leftArrow').click(this, function(e) {
      const THIS = e.data;
      if (THIS.w == 0) {
        THIS.s = THIS.s - 1;
        THIS.w = THIS.waypoints.length - 1;
      }
      else {
        THIS.w = THIS.w - 1;
      }
      THIS.pushState();
    });

    $('#rightArrow').click(this, function(e) {
      const THIS = e.data;
      const last_w = THIS.w == (THIS.waypoints.length - 1);
      if (last_w) {
        THIS.s = THIS.s + 1;
        THIS.w = 0;
      }
      else {
        THIS.w = THIS.w + 1;
      }
      THIS.pushState();
    });

    $('#edit-switch').click(this, function(e) {
      const THIS = e.data;
      if (!THIS.editing) {
        THIS.startEditing();
        THIS.pushState();
      }
    });

    $('#view-switch').click(this, function(e) {
      const THIS = e.data;
      if (THIS.editing) {
        THIS.finishEditing();
        THIS.pushState();
      }
    });

    $('#zoom-home').click(this, function(e) {
      const THIS = e.data;
      THIS.s = 0; 
      THIS.newView(true);
    });

    $('.clear-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.bufferWaypoint = undefined;
      THIS.startEditing();
      THIS.pushState();
    });
    
    $('.arrow-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.drawType = "arrow";
      if (THIS.drawing) {
        THIS.cancelDrawing(THIS);
      }
      else {
        THIS.startDrawing(THIS);
      }
      THIS.pushState();
    });

    $('.lasso-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.drawType = "lasso";
      if (THIS.drawing) {
        THIS.cancelDrawing(THIS);
      }
      else {
        THIS.startDrawing(THIS);
      }
      THIS.pushState();
    });

    $('.draw-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.drawType = "box";
      if (THIS.drawing) {
        THIS.cancelDrawing(THIS);
      }
      else {
        THIS.startDrawing(THIS);
      }
      THIS.pushState();
    });

    $('#edit_description_modal form').submit(this, function(e){
      const THIS = e.data;
      const formData = parseForm(e.target);
      $(this).closest('.modal').modal('hide');

      // Get description from form
      THIS.d = encode(formData.d);
      $('#copy_link_modal').modal('show');

      const root = THIS.location('host') + THIS.location('pathname');
      const hash = THIS.makeHash(['d', 'g', 'm', 'a', 'v', 'o', 'p']);
      const link = document.getElementById('copy_link');
      link.value = root + hash;

      return false;
    });

    this.viewer.addHandler('canvas-enter', function(e) {
      const THIS = e.userData;
      THIS.faster();
    }, this);

    const STATE = this;

    var mouse_drag = new OpenSeadragon.MouseTracker({
        element: viewer.canvas,
        dragHandler: function(event) {
            if (STATE.drawType == "lasso" && STATE.drawing) {
                STATE.viewer.setMouseNavEnabled(false);
                lasso_draw.bind(STATE)(event);
            }
        }
    })

    var mouse_up = new OpenSeadragon.MouseTracker({
        element: viewer.canvas,
        dragEndHandler: function(event) {
            if (STATE.drawType == "lasso" && STATE.drawing) {
                STATE.finishDrawing();
            }
            STATE.viewer.setMouseNavEnabled(true);
        }
    })

    this.viewer.addHandler('canvas-drag', function(e) {
      const THIS = e.userData;
      if (THIS.drawType != "box") {
        return;
      }

      const overlay = $('#' + THIS.currentOverlay);
      const position = THIS.normalize(e.position);

      if (THIS.drawing == 1) {
        THIS.drawing = 2;
        e.preventDefaultAction = true;
        THIS.drawLowerBounds(position);
      }
      else if (THIS.drawing == 2) {
        e.preventDefaultAction = true;
        THIS.drawUpperBounds(position);
      }
    }, this);

    this.viewer.addHandler('canvas-drag-end', function(e) {
      const THIS = e.userData;
      if (THIS.drawType != "box") {
        return;
      }

      const position = THIS.normalize(e.position);

      if (THIS.drawing == 2) {
        e.preventDefaultAction = true;
        THIS.drawUpperBounds(position);
        THIS.finishDrawing();
        THIS.pushState();
      }
    }, this);

    this.viewer.addHandler('canvas-click', function(e) {
      const THIS = e.userData;
      if (THIS.drawType == "lasso") {
        return;
      }
      if (THIS.drawType == "arrow") {
        const position = THIS.normalize(e.position);
        if (THIS.drawing == 1) {
          THIS.a = [position.x, position.y];
          THIS.finishDrawing();
          THIS.viewer.setMouseNavEnabled(true);
          THIS.pushState();
        }
        return;
      }

      const overlay = $('#' + THIS.currentOverlay);
      const position = THIS.normalize(e.position);

      if (THIS.drawing == 1) {
        THIS.drawing = 2;
        e.preventDefaultAction = true;
        THIS.drawLowerBounds(position);
      }
      else if (THIS.drawing == 2) {
        e.preventDefaultAction = true;
        THIS.drawUpperBounds(position);
        THIS.finishDrawing();
        THIS.viewer.setMouseNavEnabled(true);
        THIS.pushState();
      }
    }, this);

    $(this.viewer.element).mousemove(this, function(e) {
      const THIS = e.data;
      if (THIS.drawType == "lasso") {
        return;
      }

      THIS.mouseXY = e;
      if (THIS.drawing == 2) {
        THIS.drawUpperBounds(THIS.mouseXY);
      }
    });

    this.viewer.addHandler('animation', function(e) {
      const THIS = e.userData;
      const scale = THIS.viewer.viewport.getZoom();
      const pan = THIS.viewer.viewport.getCenter();
      THIS.v = [
        round4(scale),
        round4(pan.x),
        round4(pan.y)
      ];
      THIS.newView(false); 
    }, this);

    this.viewer.addHandler('animation-finish', function(e) {
      const THIS = e.userData;
      const scale = THIS.viewer.viewport.getZoom();
      const pan = THIS.viewer.viewport.getCenter();
      THIS.v = [
        round4(scale),
        round4(pan.x),
        round4(pan.y)
      ];
      THIS.pushState();
      THIS.faster();
    }, this);

    // Display viewer
    this.finishAnimation();
    this.viewer.setVisible(true);
  },

  /*
   * Editor buffers
   */ 

  get bufferWaypoint() {
    if (this.state.buffer.waypoint === undefined) {
      const viewport = this.viewport;
      const mask = this.active_masks[0];
      const group = this.group;
      return remove_undefined({
        Zoom: viewport.scale,
        Pan: [
          viewport.pan.x,
          viewport.pan.y
        ],
        Arrow: this.a,
        Mask: mask.Name,
        Polygon: this.p,
        Group: group.Name,
        Description: '',
        Name: 'Untitled',
        Overlay: this.overlay
      });
    }
    return deepCopy(this.state.buffer.waypoint);
  },

  set bufferWaypoint(bw) {
    this.state.buffer.waypoint = bw; 
  },

  /*
   * URL History
   */
  location: function(key) {
    return decodeURIComponent(location[key]);
  },

  get search() {
    const search = this.location('search').slice(1);
    const entries = search.split('&');
    return deserialize(entries);
  },

  get hash() {
    const hash = this.location('hash').slice(1);
    const entries = hash.split('#');
    return deserialize(entries);
  },

  get url() {
    const root = this.location('pathname');
    const search = this.location('search');
    const hash = this.location('hash');
    return root + search + hash;
  },

  get searchKeys() {
    const search_keys = Object.keys(this.search);
    return ['edit'].filter(x => search_keys.includes(x))
  },

  get hashKeys() {
    const oldTag = this.story.Mode == 'tag';
    if (oldTag || this.isSharedLink) {
      return ['d', 's', 'w', 'g', 'm', 'a', 'v', 'o', 'p'];
    }
    else {
      return ['s', 'w', 'g', 'm', 'a', 'v', 'o', 'p'];
    }
  },

  /*
   * Search Keys
   */
  set edit(_edit) {
		this.state.edit = !!_edit;
  },

  get edit() {
    return !!this.state.edit;
  },

  /*
   * Control keys
   */

  get token() {
    const username = 'john_hoffer@hms.harvard.edu';
    const password = document.minerva_password;
    const pass = new Promise(function(resolve, reject) {
      if (password != undefined) {
        resolve(password);
      }
      const selector = '#password_modal';
      $(selector).modal('show');
      $(selector).find('form').submit(function(e){
        $(selector).find('form').off();
        $(this).closest('.modal').modal('hide');
        const formData = parseForm(e.target);
       
        // Get password from form
        const p = formData.p;
        document.minerva_password = p;
        resolve(p);
        return false;
      });
    });
    return authenticate(username, pass);
  },

  get editing() {
    if (this.edit) {
      return this.state.editing;
    }
    return 0;
  },
  set editing(_e) {
    const e = parseInt(_e, 10);
    this.state.editing = modulo(e, 3);
    this.newView(true);
  },

  get drawType() {
    return this.state.drawType;
  },
  set drawType(_l) {
    this.state.drawType = _l;
    this.newView(true);
  },

  get drawing() {
    return this.state.drawing;
  },
  set drawing(_d) {
    const d = parseInt(_d, 10);
    this.state.drawing = modulo(d, 3);
    this.newView(true);
  },

  get mouseXY() {
    const e = this.state.mouseEvent;
    const pos = OpenSeadragon.getMousePosition(e);
    return this.normalize(pos);
  },
  set mouseXY(e) {
    this.state.mouseEvent = e;
  },

  /*
   * Hash Keys
   */

  get v() {
    return this.state.v;
  },
  set v(_v) {
    const viewer = this.viewer;
    this.state.v = _v.map(parseFloat);
  },

  get a() {
    return this.state.a;
  },
  set a(_a) {
    this.state.a = _a.map(parseFloat);
  },

  get m() {
    const m = this.state.m;
    const count = this.masks.length;
    if (count == 0) {
      return [-1]
    }
		return m;
  },
  set m(_m) {
		if (Array.isArray(_m)) {
    	this.state.m = _m.map(i => parseInt(i, 10));
		}
		else {
			this.state.m = [-1];
		}
  },

  get g() {
    const g = this.state.g;
    const count = this.cgs.length;
    return g < count ? g : 0;
  },
  set g(_g) {
    const g = parseInt(_g, 10);
    const count = this.cgs.length;
    this.state.g = modulo(g, count);
  },

  /*
   * Exhibit Hash Keys
   */

  get w() {
    const w = this.state.w[this.s] || 0;
    const count = this.waypoints.length;
    return w < count ? w : 0;
  },

  set w(_w) {
    const w = parseInt(_w, 10);
    const count = this.waypoints.length;
    this.state.w[this.s] = modulo(w, count);

    // Set group, viewport from waypoint
    const waypoint = this.waypoint;

    this.slower();
    this.m = mFromWaypoint(waypoint, this.masks);
    this.g = gFromWaypoint(waypoint, this.cgs);
    this.v = vFromWaypoint(waypoint);
    this.o = oFromWaypoint(waypoint);
    this.a = aFromWaypoint(waypoint);
    this.p = pFromWaypoint(waypoint);
    this.d = dFromWaypoint(waypoint);
    this.n = nFromWaypoint(waypoint);
  },

  get s() {
    const s = this.state.s;
    const count = this.stories.length;
    return s < count ? s : 0;
  },
  set s(_s) {
    const s = parseInt(_s, 10);
    const count = this.stories.length;
    this.state.s = modulo(s, count);

    // Update waypoint
    this.w = this.w;
  },

  /*
   * Tag Hash Keys
   */

  get o() {
    return this.state.o;
  },
  set o(_o) {
    this.state.o = _o.map(parseFloat);
  },

  get p() {
    return toPolygonURL(this.state.p);
  },
  set p(_p) {
    this.state.p = fromPolygonURL(_p);
  },

  get d() {
    return this.state.description;
  },
  set d(_d) {
    this.state.description = '' + _d;
  },

  get n() {
    return this.state.name;
  },
  set n(_n) {
    this.state.name = '' + _n;
  },

  /*
   * Configuration State
   */
  get changed() {
    return this.state.changed;
  },
  set changed(_c) {
    this.state.changed = !!_c;
  },

  get design() {
    return deepCopy(this.state.design);
  },
  set design(design) {

    const stories = design.stories;

    // Store waypoint indices for each story
    if (this.stories.length != stories.length) {
      this.state.w = stories.map(function(story, s) {
        return this.state.w[s] || 0;
      }, this);
    }

    // Update the design
    this.state.design = deepCopy(design);
  },

  get masks() {
    return this.design.masks || [];
  },
  set masks(_masks) {
    var design = this.design;
    design.masks = _masks;
    this.design = design;
    this.changed = true;
  },

  get cgs() {
    return this.design.cgs || [];
  },
  set cgs(_cgs) {
    var design = this.design;
    design.cgs = _cgs;
    this.design = design;
    this.changed = true;
  },

  get chans() {
    return this.design.chans || [];
  },
  set chans(_chans) {
    var design = this.design;
    design.chans = _chans;
    this.design = design;
    this.changed = true;
  },

  get stories() {
    return this.design.stories || [];
  },
  set stories(_stories) {
    var design = this.design;
    design.stories = _stories;
    this.design = design;
    this.changed = true;
  },

  get layout() {
    return this.design.layout || {
      Grid: []
    };
  },
  set layout(_layout) {
    var design = this.design;
    design.layout = _layout;
    this.design = design;
    this.changed = true;
  },

  get images() {
    return this.design.images || [];
  },
  set images(_images) {
    var design = this.design;
    design.images = _images;
    this.design = design;
    this.changed = true;
  },

  get grid() {
    return unpackGrid(this.layout, this.images, 'Grid');
  },

  get target() {
    return unpackGrid(this.layout, this.images, 'Target');
  },

  /*
   * Derived State
   */

  get isSharedLink() {
    const yes_d = this.hash.hasOwnProperty('d');
    const no_s = !this.hash.hasOwnProperty('s');
    const no_shared_link = this.stories.filter(story => {
      return story.Mode == 'tag';
    }).length == 0;
    return yes_d && (no_s || no_shared_link);
  },

  get isMissingHash() {
    const no_s = !this.hash.hasOwnProperty('s');
    return !this.isSharedLink && no_s;
  },

  get story() {
    return this.stories[this.s];
  },
  set story(story) {
    const stories = this.stories;
    stories[this.s] = story;
    this.stories = stories;
  },

  get active_masks() {
		const masks = this.masks;
		return this.m.map(function(m) {
			const mask = masks[m];
			return mask? mask : {};
		});
  },

  get group() {
    return this.cgs[this.g];
  },

  get colors() {
    return this.group.Colors;
  },

  get channels() {
    return this.group.Channels;
  },

  get waypoints() {
    return this.story.Waypoints;
  },
  set waypoints(waypoints) {
    const story = this.story;
    story.Waypoints = waypoints;
    this.story = story;
  },

  get waypoint() {
    if (this.editing) {
      return this.bufferWaypoint;
    }
    return this.waypoints[this.w];
  },
  set waypoint(waypoint) {
    if (this.editing) {
      this.bufferWaypoint = waypoint;
    }
    else {
      const waypoints = this.waypoints;
      waypoints[this.w] = waypoint;
      this.waypoints = waypoints;
    }
  },

  get viewport() {
    const v = this.v;
    return {
      scale: v[0],
      pan: new OpenSeadragon.Point(v[1], v[2])
    };
  },

  get overlay() {
    const o = this.o;
    return {
      x: o[0],
      y: o[1],
      width: o[2],
      height: o[3]
    };
  },

  /*
   * State manaagement
   */

  newExhibit: function() {
    const exhibit = this.exhibit;
    const cgs = deepCopy(exhibit.Groups || []);
    const masks = deepCopy(exhibit.Masks || []);
    const stories = deepCopy(exhibit.Stories || []);

    this.design = {
      chans: deepCopy(exhibit.Channels || []),
      layout: deepCopy(exhibit.Layout || {}),
      images: deepCopy(exhibit.Images || []),
      stories: stories,
      masks: masks,
      cgs: cgs
    };

    const outline_story = this.newTempStory('outline');
    this.stories = [outline_story].concat(this.stories);
    const explore_story = this.newTempStory('explore');
    this.stories = this.stories.concat([explore_story]);
  },
  newTempStory: function(mode) {
    const exhibit = this.exhibit;
    const group = this.group;
		const mask = this.active_masks[0];
    const a = this.a;
    const o = this.o;
    const p = this.p;
    const v = this.v;
    const d = this.d;

    const name = {
      'explore': 'Free Explore',
      'tag': 'Shared Link',
      'outline': 'Outline'
    }[mode];

    const groups = {
      'explore': this.cgs.map(group => group.Name),
    }[mode];

    const masks = {
      'explore': this.masks.map(mask => mask.Name),
    }[mode];

    return {
      Description: '',
      Mode: mode,
      Name: name || 'Story',
      Waypoints: [remove_undefined({
        Zoom: v[0],
        Arrow: a,
        Polygon: p,
        Pan: v.slice(1),
        Mask: mask.Name,
        Group: group.Name,
        Masks: masks,
        Groups: groups,
        Description: decode(d),
        Name: name || 'Waypoint',
        Overlay: {
          x: o[0],
          y: o[1],
          width: o[2],
          height: o[3],
        },
      })]
    }
  },
  pushState: function() {

    const url = this.makeUrl(this.hashKeys, this.searchKeys);

    if (this.url == url && !this.changed) {
      return;
    }

    if (this.embedded) {
      history.replaceState(this.design, document.title, url);
    }
    else {
      history.pushState(this.design, document.title, url);
    }

    window.onpopstate();
    this.changed = false;
  },
  popState: function(e) {
    if (e && e.state) {
      this.changed = false;
      this.design = e.state;
    }
    const hash = this.hash;
    const search = this.search;
    const searchKeys = this.searchKeys;

    // Take search parameters
    this.searchKeys.forEach(function(key) {
      this[key] = search[key];
    }, this);

    // Accept valid hash
    this.hashKeys.forEach(function(key) {
      if (hash.hasOwnProperty(key)) {
        this[key] = hash[key];
      }
    }, this);

    if (this.isSharedLink) {
      this.d = hash.d;
      const tag_story = this.newTempStory('tag'); 
      this.stories = this.stories.concat([tag_story]);
      this.s = this.stories.length - 1;
      this.pushState();
    }
    else if (this.isMissingHash) {
      this.s = 0; 
      this.pushState();
    }

    // Always update
    this.newView(true);
  },
  newView: function(redraw) {

    this.trackers.forEach(t => t.destroy());
    this.trackers = [];

    this.addPolygon("selection", this.state.p);
    this.allOverlays.forEach(function(el) {
      const [s, w] = el.split('-').slice(2);
      const overlay = this.stories[s].Waypoints[w].Overlay;
      this.addOverlay(overlay, el);
    }, this)
    this.addArrow(this.a);

   // Redraw design
    if(redraw) {
      // Update OpenSeadragon
      this.activateViewport();
      newMarkers(this.tileSources, this.group, this.active_masks);
      // Redraw HTML Menus
      this.addChannelLegends();

      this.addMasks();
      this.addGroups();
      this.newStories();
      if (this.edit) {
        this.fillWaypointEdit();
      }
      else {
        this.fillWaypointView();
      }
      // back and forward
      $('.step-back').click(this, function(e) {
        const THIS = e.data;
        THIS.w -= 1;
        THIS.pushState();
      });
      $('.step-next').click(this, function(e) {
        const THIS = e.data;
        THIS.w += 1;
        THIS.pushState();
      });

      // Waypoint-specific Copy Buttons
      const STATE = this;
      $('.edit_copy_button').each(function() {
        newCopyYamlButton.call(this, STATE);
      });
    }

    // Based on control keys
    const editing = this.editing;
    const drawing = this.drawing;
    const drawType = this.drawType;

    // Based on search keys
    activeOrNot('#view-switch', !editing);
    activeOrNot('#edit-switch', editing);

    toggleCursor('crosshair', drawing);

    greenOrWhite('.draw-switch *', drawing && (drawType == "box"));
    greenOrWhite('.lasso-switch *', drawing && (drawType == "lasso"));
    greenOrWhite('.arrow-switch *', drawing && (drawType == "arrow"));
    //greenOrWhite('#edit-switch *', editing);
  },

  makeUrl: function(hashKeys, searchKeys) {
    const root = this.location('pathname');
    const hash = this.makeHash(hashKeys);
    const search = this.makeSearch(searchKeys);
    return  root + search + hash;
  },

  makeHash: function(hashKeys) {
    const hash = serialize(hashKeys, this, '#');
    return hash? '#' + hash : '';
  },

  makeSearch: function(searchKeys) {
    const search = serialize(searchKeys, this, '&');
    return search? '?' + search : '';
  },

  /*
   * User intercation
   */
  normalize: function(pixels) {
    const vp = this.viewer.viewport;
    const norm = vp.viewerElementToViewportCoordinates;
    return norm.call(vp, pixels);
  },
  drawLowerBounds: function(position) {
    const wh = [0, 0];
    const new_xy = [
      position.x, position.y
    ];
    this.o = new_xy.concat(wh);
    this.newView(false);
  },
  computeBounds: function(value, start, len) {
    const center = start + (len / 2);
    const end = start + len;
    // Below center
    if (value < center) {
      return {
        start: value,
        range: end - value,
      };
    }
    // Above center
    return {
      start: start,
      range: value - start,
    };
  },
  drawUpperBounds: function(position) {
    const xy = this.o.slice(0, 2);
    const wh = this.o.slice(2);

    // Set actual bounds
    const x = this.computeBounds(position.x, xy[0], wh[0]);
    const y = this.computeBounds(position.y, xy[1], wh[1]);

    const o = [x.start, y.start, x.range, y.range];
    this.o = o.map(round4);
    this.newView(false);
  },

  startEditing: function(_waypoint) {
    const bw = _waypoint || this.bufferWaypoint;
    this.bufferWaypoint = bw;

    this.v = vFromWaypoint(bw);
    this.o = oFromWaypoint(bw);
    this.p = pFromWaypoint(bw);
    this.d = dFromWaypoint(bw);
    this.n = nFromWaypoint(bw);
    this.a = aFromWaypoint(bw);
    this.m = mFromWaypoint(bw, this.masks);
    this.g = gFromWaypoint(bw, this.cgs);
    this.editing = 1;
  },

  cancelEditing: function() {
    this.editing = 0;
  },

  finishEditing: function() {
    const bw = this.bufferWaypoint;
    bw.Group = this.group.Name;
    bw.Name = decode(this.n);
    bw.Description = decode(this.d);
    bw.Zoom = this.viewport.scale;
    bw.Overlay = this.overlay;
    bw.Polygon = this.p;
    bw.Arrow = this.a;
    bw.Pan = [
      this.viewport.pan.x,
      this.viewport.pan.y
    ];
    this.bufferWaypoint = bw;
    this.pushState();
    this.editing = 0;
  },

  startDrawing: function() {
    this.drawing = 1;

    const waypoint = this.waypoint;
 
    if (this.drawType == "lasso") {
      this.p = toPolygonURL([]);
    }
    else if (this.drawType == "arrow") {
      this.a = [-100, -100];
    }
    else {
      this.o = [-100, -100, 1, 1];
    }
  },
  cancelDrawing: function() {
    this.drawing = 0;
  },

  finishDrawing: function() {

    if (this.editing) {
      this.drawing = 0;
      this.finishEditing();
      this.startEditing();
      this.pushState();
    }
    else {
      $('#edit_description_modal').modal('show');
    }
  },

  finishAnimation: function() {
    const target = this.viewer.viewport.getBounds();
    this.viewer.viewport.fitBounds(target, true);
  },
  faster: function() {
    changeSprings(this.viewer, 1.2, 6.4);
  },
  slower: function() {
    changeSprings(this.viewer, 3.2, 6.4);
  },

  get allOverlays() {
    return this.stories.reduce((overlays, story, s) => {
      return overlays.concat(story.Waypoints.map((_, w) => {
        return 'current-overlay-' + s + '-' + w;
      }));
    }, []);
  },

  get currentOverlay() {
    return 'current-overlay-' + this.s + '-' + this.w;
  },

  /*
   * Display manaagement
   */
  addPolygon: function(id, polygon) {
    svg_overlay = this.svg_overlay;

    d3.select('#' + id).remove();
    var selPoly = svg_overlay.selectAll(id).data([polygon]);
    selPoly.enter().append("polygon")
        .attr('id', id)
        .attr("points",function(d) {
            return d.map(function(d) { return [d.x,d.y].join(","); }).join(" ");
        });
  },

  addArrow: function(arrow) {

    const el = "arrow-overlay";
    const current = this.viewer.getOverlayById(el);
    const xy = new OpenSeadragon.Point(arrow[0], arrow[1]);
    if (current) {
      current.update({
        location: xy,
      });
    }
    else {
      this.viewer.addOverlay({
        x: arrow[0],
        y: arrow[1],
        element: el
      });
    }
  },

  addOverlay: function(overlay, el) {

    const current = this.viewer.getOverlayById(el);
    if (el == this.currentOverlay) {
      overlay = this.overlay;
    }

    if (this.story.Mode != 'outline') {
      if (el != this.currentOverlay) {
        if (current) {
          const xy = new OpenSeadragon.Point(-100, -100);
          current.update({
            location: xy,
            width: 1,
            height: 1,
          });
        }
        return; 
      }
    }

    if (!document.getElementById(el)) {
      var div = document.createElement("div"); 
      div.className = "white overlay";
      div.id = el;
      document.getElementById('all-overlays').appendChild(div); 
    }

    const xy = new OpenSeadragon.Point(overlay.x, overlay.y);
    const is_green = this.drawing && this.drawType == "box";
    greenOrWhite('#' + el, is_green);

    if (current) {
      current.update({
        location: xy,
        width: Math.min(1, overlay.width),
        height: Math.min(1, overlay.height)
      });
    }
    else {
      this.viewer.addOverlay({
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
        element: el
      });
    }

    if (this.story.Mode == 'outline') {
      const tracker = new OpenSeadragon.MouseTracker({
        element: document.getElementById(el),
        clickHandler: (function(event) {
          const [s, w] = el.split('-').slice(2);
          this.s = s;
          this.w = w;
          this.pushState();
        }).bind(this)
      });
      this.trackers.push(tracker);
    }
  },

  addMasks: function() {
    $('#mask-layers').empty();
    const mask_names = this.waypoint.Masks || [];
    const masks = this.masks.filter(mask => {
      return mask_names.includes(mask.Name);
    });
    if (masks.length) {
      $('#mask-label').show()
    }
    else {
      $('#mask-label').hide()
    }
    masks.forEach(function(mask) {
      const m = index_name(this.masks, mask.Name);
      this.addMask(mask, m);
    }, this);
  },

  addMask: function(mask, m) {
    var aEl = document.createElement('a');
    aEl = Object.assign(aEl, {
      className: this.m.includes(m) ? 'nav-link active' : 'nav-link',
      href: 'javascript:;',
      innerText: mask.Name,
      title: mask.Path,
      id: mask.Path,
    });
    var ariaSelected = this.m.includes(m) ? true : false;
    aEl.setAttribute('aria-selected', ariaSelected);

    // Append everything
    document.getElementById('mask-layers').appendChild(aEl);
    
    // Update Channel Group
    $(aEl).click(this, function(e) {
      THIS = e.data;
      if (THIS.m.includes(m)){
        THIS.m = THIS.m.filter(i => i != m);
      }
      else {
        THIS.m.push(m);
      }
      THIS.pushState();
    });
  },

  addGroups: function() {
    $('#channel-groups').empty();
    const cgs_names = this.waypoint.Groups || [];
    const cgs = this.cgs.filter(group => {
      return cgs_names.includes(group.Name);
    });
    if (cgs.length) {
      $('#channel-label').show()
    }
    else {
      $('#channel-label').hide()
    }
    cgs.forEach(function(group) {
      const g = index_name(this.cgs, group.Name);
      this.addGroup(group, g);
    }, this);
  },
  addGroup: function(group, g) {
    var aEl = document.createElement('a');
    aEl = Object.assign(aEl, {
      className: this.g === g ? 'nav-link active' : 'nav-link',
      href: 'javascript:;',
      innerText: group.Name,
      title: group.Path,
      id: group.Path,
    });
    var ariaSelected = this.g === g ? true : false;
    aEl.setAttribute('aria-selected', ariaSelected);
    aEl.setAttribute('data-toggle', 'pill');

    // Append everything
    document.getElementById('channel-groups').appendChild(aEl);
    
    // Update Channel Group
    $(aEl).click(this, function(e) {
      THIS = e.data;
      THIS.g = g;
      THIS.pushState();
    });
  },

  activateViewport: function() {
    const viewport = this.viewer.viewport;
    viewport.panTo(this.viewport.pan);
    viewport.zoomTo(this.viewport.scale);
  },

  addChannelLegends: function() {
    $('#channel-legend').empty();
    this.channels.forEach(this.addChannelLegend, this);
  },

  // Add channel legend label
  addChannelLegend: function(channel, c) {
    const color = this.indexColor(c, '#FFF');

    var label = document.createElement('span');
    label.className = 'legend-label pl-3';
    label.innerText = channel;

    var badge = document.createElement('span');
    $(badge).css('background-color', color);
    badge.className = 'badge legend-color';
    badge.innerText = '\u00a0';

    // Append everything
    var ul = document.getElementById('channel-legend');
    var li = document.createElement('li');
    li.appendChild(badge);
    li.appendChild(label);
    ul.appendChild(li);
  },

  channelSettings: function(channels) {
    const chans = this.chans;
    if (channels == undefined) {
      return {}
    }
    return channels.reduce(function(map, c){
      const i = index_name(chans, c);
      if (i >= 0) {
        map[c] = chans[i];
      }
      return map;
    }, {});
  },

  channelOrders: function(channels) {
    return channels.reduce(function(map, c, i){
      map[c] = i;
      return map;
    }, {});
  },

  indexColor: function(i, empty) {
    const colors = this.colors;
    if (i === undefined) {
      return empty;
    }
    return '#' + colors[i % colors.length];
  },

  newStories: function() {

    const items = document.getElementById('story-container');
    // Remove existing stories
    clearChildren(items);

    if (this.story.Mode != 'outline') {
      return;
    }

    // Add configured stories
    this.stories.forEach(function(story, sid) {
      if (story.Mode == undefined) {
        this.addStory(story, sid, items);
      }
    }, this);
  },

  addStory: function(story, sid, items) {

    var sid_item = document.createElement('div');
    var sid_list = document.createElement('ul');
    var sid_label = document.createElement('p');
    sid_label.innerText = story.Name;

    // Add configured waypoints
    story.Waypoints.forEach(function(waypoint, wid) {
      this.addWaypoint(waypoint, wid, sid, sid_list);
    }, this);

    sid_item.appendChild(sid_label);
    sid_item.appendChild(sid_list);
    items.appendChild(sid_item);
  },

  addWaypoint: function(waypoint, wid, sid, sid_list) {

    var wid_item = document.createElement('li');
    var wid_link = document.createElement('a');
    wid_link = Object.assign(wid_link, {
      className: '',
      href: 'javascript:;',
      innerText: waypoint.Name
    });

    // Update Waypoint
    $(wid_link).click(this, function(e) {
      const THIS = e.data;
      THIS.s = sid;
      THIS.w = wid;
      THIS.pushState();
    });

    wid_item.appendChild(wid_link);
    sid_list.appendChild(wid_item);
  },

  fillWaypointView: function() {
    const waypoint = this.waypoint;
    const wid_waypoint = document.getElementById('viewer-waypoint');
    const audioPlayer = document.getElementById("audioPlayer");
    const waypointName = document.getElementById("waypointName");

    if (waypoint.Audio) {
      audioPlayer.src = waypoint.Audio;
      audioPlayer.style.visibility = 'visible';
    }
    else {
      audioPlayer.style.visibility = 'hidden';
    }
    waypointName.innerText = waypoint.Name;

    const md = waypoint.Description;
    wid_waypoint.innerHTML = this.showdown.makeHtml(md);


    // Color code elements
    const channelOrders = this.channelOrders(this.channels);
    const wid_code = wid_waypoint.getElementsByTagName('code');
    for (var i = 0; i < wid_code.length; i ++) {
      var code = wid_code[i];
      var index = channelOrders[code.innerText];
      var color = this.indexColor(index);
      var border = color? 'solid ' + color: 'dashed #AAA';
      $(code).css('border-bottom', '1px ' + border);
    }
    // Style waypoint elements
    if (waypoint.hasOwnProperty('Style')) {
      const wid_style = waypoint.Style;
      $(wid_waypoint).css(wid_style);
    }
  },
  fillWaypointEdit: function() {
    
    const wid_waypoint = document.getElementById('viewer-waypoint');
    $(wid_waypoint).empty();
    const form_proto = document.getElementsByClassName('save_edits_form')[0]
    const form = form_proto.cloneNode(true);
    wid_waypoint.appendChild(form);



    const wid_txt = $(wid_waypoint).find('.edit_text')[0];
    const wid_txt_name = $(wid_waypoint).find('.edit_name')[0];
    const wid_describe = decode(this.d);
    const wid_name = decode(this.n);

    $(wid_txt_name).on('input', this, function(e) {
      const THIS = e.data;
      THIS.n = encode(this.value);
    });
    wid_txt_name.value = wid_name;

    $(wid_txt).on('input', this, function(e) {
      const THIS = e.data;
      THIS.d = encode(this.value);
    });
    wid_txt.value = wid_describe;
  },

  get bufferYaml() {
    const viewport = this.viewport;
    const waypoint = this.waypoint;
    waypoint.Overlay = this.overlay; 
    waypoint.Name = decode(this.n);
    waypoint.Description = decode(this.d);
    waypoint.Group = this.cgs[this.g].Name;
    waypoint.Pan = [viewport.pan.x, viewport.pan.y];
    waypoint.Zoom = viewport.scale;

    const wid_yaml = jsyaml.safeDump([[[[[waypoint]]]]], {
      lineWidth: 40,
      noCompatMode: true,
    });
    return wid_yaml.replace('- - - - - ', '        - ');
  }
};


const getAjaxHeaders = function(state, image){
  if (image.Provider == 'minerva') {
    return state.token.then(function(token){
      return {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'image/png'
      };
    });  
  }
  return Promise.resolve({});
};


const getGetTileUrl = function(image, layer, channelSettings) {

  const colors = layer.Colors;
  const channels = layer.Channels;

  const getJpegTile = function(level, x, y) {
    const fileExt = '.' + layer.Format;
    return image.Path + '/' + layer.Path + '/' + (image.MaxLevel - level) + '_' + x + '_' + y + fileExt;
  };

  if (image.Provider != 'minerva') {
    return getJpegTile; 
  }


  const channelList = channels.reduce(function(list, c, i) {
    const settings = channelSettings[c];
    if (settings == undefined) {
      return list;
    }
    const allowed = settings.Images;
    if (allowed.indexOf(image.Name) >= 0) {
      const index = settings.Index;
      const color = colors[i];
      const min = settings.Range[0];
      const max = settings.Range[1];
      const specs = [index, color, min, max];
      list.push(specs.join(','));
    }
    return list;
  }, []);
  const channelPath = channelList.join('/');

  const getMinervaTile = function(level, x, y) {
    const api = image.Path + '/render-tile/';
    const lod = (image.MaxLevel - level) + '/';
    const pos = x + '/' + y + '/0/0/';
    const url = api + pos + lod + channelPath;
    return url; 
  };

  return getMinervaTile;
};

const arrange_images = function(viewer, tileSources, state, init) {

  const cgs = state.cgs;
  const masks = state.masks;

  cgs.forEach(g => {
    g['Format'] = g['Format'] || 'jpg';
  });
  masks.forEach(m => {
    m['Format'] = m['Format'] || 'png';
  });
  const layers = cgs.concat(masks);

  const grid = state.grid;

  const numRows = grid.length;
  const numColumns = grid[0].length;

  const nTotal = numRows * numColumns * layers.length;
  var nLoaded = 0;

  const spacingFraction = 0.05;
  const maxImageWidth = flatten(grid).reduce(function(max, img) {
    return Math.max(max, img.Width);
  }, 0);
  const maxImageHeight = flatten(grid).reduce(function(max, img) {
    return Math.max(max, img.Height);
  }, 0);

  const cellHeight = (1 + spacingFraction) / numRows - spacingFraction;
  const cellWidth = cellHeight * maxImageWidth / maxImageHeight;

  for (var yi = 0; yi < numRows; yi++) {
    const y = yi * (cellHeight + spacingFraction);

    for (var xi = 0; xi < numColumns; xi++) {
      const image = grid[yi][xi];
      const displayHeight = (1 - (numRows-1) * spacingFraction) / numRows * image.Height / maxImageHeight;
      const displayWidth = displayHeight * image.Width / image.Height;
      const x = xi * (cellWidth + spacingFraction) + (cellWidth - displayWidth) / 2;

      for (var j=0; j < layers.length; j++) {
        const layer = layers[j];
        const channelSettings = state.channelSettings(layer.Channels);
        getAjaxHeaders(state, image).then(function(ajaxHeaders){
          const useAjax = (image.Provider == 'minerva');
          viewer.addTiledImage({
            loadTilesWithAjax: useAjax,
            crossOriginPolicy: useAjax? 'Anonymous': undefined,
            ajaxHeaders: ajaxHeaders,
            tileSource: {
              height: image.Height,
              width:  image.Width,
              maxLevel: image.MaxLevel,
              tileWidth: image.TileSize.slice(0,1).pop(),
              tileHeight: image.TileSize.slice(0,2).pop(),
              getTileUrl: getGetTileUrl(image, layer, channelSettings)
            },
            x: x,
            y: y,
            opacity: 0,
            width: displayWidth,
            //preload: true,
            success: function(data) {
              const item = data.item;
              if (!tileSources.hasOwnProperty(layer.Path)) {
                tileSources[layer.Path] = [];
              }
              tileSources[layer.Path].push(item);

              // Initialize hash state
              nLoaded += 1;
              if (nLoaded == nTotal) {
                init();
              }
            }
          });
        });
      }

      const titleElt = $('<p>');
      const title = image.Description;
      titleElt.addClass('overlay-title').text(title);
      viewer.addOverlay({
        element: titleElt[0],
        x: x + displayWidth / 2,
        y: y,
        placement: 'BOTTOM',
        checkResize: false
      });
      viewer.addOverlay({
        x: x,
        y: y,
        width: displayWidth,
        height: image.Height / image.Width * displayWidth,
        className: 'slide-border'
      });
    }
  }
};

const build_page = function(exhibit, options) {

  // Initialize openseadragon
  const viewer = OpenSeadragon({
    id: 'openseadragon1',
    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.3.1/images/',
    navigatorPosition: 'BOTTOM_RIGHT',
    zoomOutButton: 'zoom-out',
    zoomInButton: 'zoom-in',
    homeButton: 'zoom-home',
    maxZoomPixelRatio: 10,
  });
  const tileSources = {};
  const state = new HashState(viewer, tileSources, exhibit, options);
  const init = state.init.bind(state);
  arrange_images(viewer, tileSources, state, init);
  return viewer;
};
const index_name = function(list, name) {
  if (!Array.isArray(list)) {
    return -1;
  }
  const item = list.filter(function(i) {
    return (i.Name == name);
  })[0];
  return list.indexOf(item);
};

