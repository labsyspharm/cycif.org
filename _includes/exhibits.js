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
  const names = waypoint.ActiveMasks || [];
  const m = names.map(name => index_name(masks, name));
  if (m.length < 2) {
    return [-1].concat(m);
  }
  return m;
};

const aFromWaypoint = function(waypoint, masks) {
  const arrows = waypoint.Arrows || [{}]
  const arrow = arrows[0].Point;
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
    waypoint.Overlays[0].x,
    waypoint.Overlays[0].y,
    waypoint.Overlays[0].width,
    waypoint.Overlays[0].height,
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
  this.pollycache = {};
  this.embedded = options.embedded || false;
  this.showdown = new showdown.Converter();
  this.tileSources = tileSources;
  this.exhibit = exhibit;
  this.viewer = viewer;
  viewer.scalebar({
    location: 3,
    minWidth: '100px',
    type: 'Microscopy',
    stayInsideImage: false,
    pixelsPerMeter: 1000000*exhibit.PixelsPerMicron || 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    fontColor: 'rgb(255, 255, 255)',
    color: 'rgb(255, 255, 255)'
  })

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
    drawing: 0
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
    window.onpopstate();

    // Edit name
    $('#exhibit-name').text(this.exhibit.Name);

    $('.modal_copy_button').each(newCopyButton);

    $('#zoom-in').tooltip({
      title: 'Zoom in'
    });
    $('#zoom-out').tooltip({
      title: 'Zoom out'
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

    $('#toggle-legend').click(function(e) {
      e.preventDefault();
      $("#legend").toggleClass("toggled");
    });

    const THIS = this;

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
      window.onpopstate();
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
      window.onpopstate();
    });

    $('#edit-switch').click(this, function(e) {
      const THIS = e.data;
      if (!THIS.edit) {
        THIS.startEditing();
        THIS.pushState();
        window.onpopstate();
      }
    });

    $('#view-switch').click(this, function(e) {
      const THIS = e.data;
      if (THIS.edit) {
        THIS.finishEditing();
        THIS.pushState();
        window.onpopstate();
      }
    });

    $('#toc-button').click(this, function(e) {
      const THIS = e.data;
      if (THIS.waypoint.Mode != 'outline') {
        THIS.s = 0; 
        THIS.pushState();
        window.onpopstate();
      }
    });

    $('.clear-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.bufferWaypoint = undefined;
      THIS.startEditing();
      THIS.pushState();
      window.onpopstate();
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
      THIS.newView(false);
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
      THIS.newView(false);
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
      THIS.newView(false);
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
        THIS.newView(false);
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
          THIS.newView(false);
        }
        return;
      }

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
        THIS.newView(false);
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
      THIS.newView(false);
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
      return remove_undefined({
        Zoom: viewport.scale,
        Pan: [
          viewport.pan.x,
          viewport.pan.y
        ],
        Arrows: [{
          Point: this.a,
          Text: '',
          HideArrow: false
        }],
        ActiveMasks: undefined,
        Masks: undefined,
        Polygon: this.p,
        Group: this.group.Name,
        Groups: undefined,
        Description: '',
        Name: 'Untitled',
        Overlays: [this.overlay]
      });
    }
    return this.state.buffer.waypoint;
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
    const oldTag = this.waypoint.Mode == 'tag';
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

  get drawType() {
    return this.state.drawType;
  },
  set drawType(_l) {
    this.state.drawType = _l;
    this.newView(false);
  },

  get drawing() {
    return this.state.drawing;
  },
  set drawing(_d) {
    const d = parseInt(_d, 10);
    this.state.drawing = modulo(d, 3);
    this.newView(false);
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
    // this.o = oFromWaypoint(waypoint);
    // this.a = aFromWaypoint(waypoint);
    this.o = [-100, -100, 1, 1];
    this.a = [-100, -100];
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
    return this.state.design;
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
    this.state.design = design;
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

  get currentCount() {
    const s = this.s;
    const w = this.w;
    return this.stories.reduce(function(count, story, idx) {
      if (s == idx) {
        return count + w;
      }
      else if (s > idx) {
        return count + story.Waypoints.length;
      }
      else {
        return count;
      }
    }, 1);
  },

  get totalCount() {
    return this.stories.reduce(function(count, story) {
      return count + story.Waypoints.length;
    }, 0);
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
      return masks[m];
    }).filter(name => name != undefined);
  },

  get group() {
    return this.cgs[this.g];
  },

  get colors() {
    const g_colors = this.group.Colors;
    return g_colors.concat(this.active_masks.reduce((c, m) => {
      return c.concat(m.Colors || []);
    }, []));
  },

  get channels() {
    const g_chans = this.group.Channels;
    return g_chans.concat(this.active_masks.reduce((c, m) => {
      return c.concat(m.Channels || []);
    }, []));
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
    if (this.edit) {
      return this.bufferWaypoint;
    }
    var waypoint = this.waypoints[this.w];
    if (!waypoint.Overlays) {
      waypoint.Overlays = [{
        x: -100,
        y: -100,
        width: 1,
        height: 1
      }];
    }
    return waypoint;
  },
  set waypoint(waypoint) {
    if (this.edit) {
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
    const cgs = exhibit.Groups || [];
    const masks = exhibit.Masks || [{}];
    var stories = exhibit.Stories || [];
    stories = stories.map(story => {
      story.Waypoints = story.Waypoints.map(waypoint => {
        if (waypoint.Overlay != undefined) {
          waypoint.Overlays = [waypoint.Overlay];
        }
        return waypoint;
      })
      return story;
    }) 

    this.design = {
      chans: exhibit.Channels || [],
      layout: exhibit.Layout || {},
      images: exhibit.Images || [],
      header: exhibit.Header || '',
      footer: exhibit.Footer || '',
      default_group: exhibit.DefaultGroup || '',
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
    const a = this.a;
    const o = this.o;
    const p = this.p;
    const v = this.v;

    const header = this.design.header;
    const d = mode == 'outline' ? encode(header) : this.d;

    const name = {
      'explore': 'Free Explore',
      'tag': 'Shared Link',
      'outline': ' '
    }[mode];

    const groups = {
      'explore': this.cgs.filter(group => group.Name).map(group => group.Name),
    }[mode];

    const masks = {
      'explore': this.masks.filter(mask => mask.Name).map(mask => mask.Name),
    }[mode];

    return {
      Mode: mode,
      Description: '',
      Name: name || 'Story',
      Waypoints: [remove_undefined({
        Mode: mode,
        Zoom: v[0],
        Arrows: [{
          Point: a
        }],
        Polygon: p,
        Pan: v.slice(1),
        ActiveMasks: [],
        Group: group.Name,
        Masks: masks,
        Groups: groups,
        Description: decode(d),
        Name: name || 'Waypoint',
        Overlays: [{
          x: o[0],
          y: o[1],
          width: o[2],
          height: o[3],
        }],
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
      window.onpopstate();
    }
    else if (this.isMissingHash) {
      this.s = 0; 
      const welcome = $('#welcome_modal');
      const channel_count = welcome.find('.channel_count')[0];
      channel_count.innerText = this.channels.length;
      welcome.modal('show');

      this.pushState();
      window.onpopstate();
    }

    this.loadPolly(this.waypoint.Description);
    // Always update
    this.newView(true);
  },
  newView: function(redraw) {


    this.trackers.forEach(t => t.destroy());
    this.trackers = [];

    this.addPolygon("selection", this.state.p);
    this.allOverlays.forEach(function(indices) {
      const [prefix, s, w, o] = indices;
      var overlay = this.overlay;
      if (prefix == 'waypoint-overlay') {
        overlay = this.stories[s].Waypoints[w].Overlays[o];
      }
      el = indices.join('-');
      this.addOverlay(overlay, el);
    }, this)

    const THIS = this;
    $.each($('.arrow-overlay'), function(id, el) {
      const current = THIS.viewer.getOverlayById(el.id);
      const xy = new OpenSeadragon.Point(-100, -100);
      if (current) {
        current.update({
          location: xy,
        });
      }
    });

    this.allArrows.forEach(function(indices) {
      this.addArrow(indices);
    }, this);

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
        window.onpopstate();
      });
      $('.step-next').click(this, function(e) {
        const THIS = e.data;
        THIS.w += 1;
        THIS.pushState();
        window.onpopstate();
      });

      // Waypoint-specific Copy Buttons
      const STATE = this;
      $('.edit_copy_button').each(function() {
        newCopyYamlButton.call(this, STATE);
      });
      $('#edit_toggle_arrow').click(this, function(e) {
        const THIS = e.data;
        const arrow_0 = THIS.waypoint.Arrows[0];
        const hide_arrow = arrow_0.HideArrow;
        arrow_0.HideArrow = hide_arrow ? false : true;
        THIS.newView(true);
      });
    }

    if (this.edit) {
      const THIS = this;

      $("#mask-picker").off("changed.bs.select");
      $("#mask-picker").on("changed.bs.select", function(e, idx, isSelected, oldValues) {
        const newValue = $(this).find('option').eq(idx).text();
        THIS.waypoint.Masks = THIS.masks.map(mask => mask.Name).filter(function(name) {
          if (isSelected) {
            return oldValues.includes(name) || name == newValue;
          }
          return oldValues.includes(name) && name != newValue;
        });
        const active_names = THIS.active_masks.map(mask => mask.Name).filter(function(name) {
          return THIS.waypoint.Masks.includes(name)
        })
        THIS.waypoint.ActiveMasks = active_names;
        THIS.m = active_names.map(name => index_name(THIS.masks, name));
        THIS.newView(true);
      });

      $("#group-picker").off("changed.bs.select");
      $("#group-picker").on("changed.bs.select", function(e, idx, isSelected, oldValues) {
        const newValue = $(this).find('option').eq(idx).text();
        THIS.waypoint.Groups = THIS.cgs.map(group => group.Name).filter(function(name) {
          if (isSelected) {
            return oldValues.includes(name) || name == newValue;
          }
          return oldValues.includes(name) && name != newValue;
        });
        const group_names = THIS.waypoint.Groups;
        const current_name = THIS.cgs[THIS.g].Name;
        if (group_names.length > 0 && !group_names.includes(current_name)) {
          THIS.g = index_name(THIS.cgs, group_names[0]);
        }
        THIS.newView(true);
      });

    }

    // Based on control keys
    const edit = this.edit;
    const drawing = this.drawing;
    const drawType = this.drawType;

    // Based on search keys
    activeOrNot('#view-switch', !edit);
    activeOrNot('#edit-switch', edit);

    displayOrNot('#home-button', !edit && this.waypoint.Mode == 'outline');
    displayOrNot('#toc-button', !edit && this.waypoint.Mode != 'outline');
    displayOrNot('.editControls', edit);
    displayOrNot('#waypointControls', !edit);
    displayOrNot('#waypointName', !edit);

    toggleCursor('crosshair', drawing);

    greenOrWhite('.draw-switch *', drawing && (drawType == "box"));
    greenOrWhite('.lasso-switch *', drawing && (drawType == "lasso"));
    greenOrWhite('.arrow-switch *', drawing && (drawType == "arrow"));
  },

  loadPolly: function(txt) {
    var polly_url = this.pollycache[this.currentCount];
    if (polly_url) {
      document.getElementById('audioSource').src = polly_url;
      document.getElementById('audioPlayback').load();
    }
    else {
      const THIS = this;
      speakText(txt).then(function(url) {
        THIS.pollycache[THIS.currentCount] = url;
        document.getElementById('audioSource').src = url;
        document.getElementById('audioPlayback').load();
      });
    }
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
  },

  finishEditing: function() {
    const bw = this.bufferWaypoint;
    bw.Group = this.group.Name;
    bw.Name = decode(this.n);
    bw.Description = decode(this.d);
    bw.Zoom = this.viewport.scale;
    bw.Overlays = [this.overlay];
    bw.ActiveMasks = this.active_masks.map(mask => mask.Name)
    bw.Arrows[0].Point = this.a;
    bw.Polygon = this.p;
    bw.Pan = [
      this.viewport.pan.x,
      this.viewport.pan.y
    ];
    this.bufferWaypoint = bw;
    this.pushState();
    window.onpopstate();
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

    if (this.edit) {
      this.drawing = 0;
      this.finishEditing();
      this.startEditing();
      this.pushState();
      this.newView(false);
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

  get allArrows() {
    return this.stories.reduce((all, story, s) => {
      return all.concat(story.Waypoints.reduce((idx, _, w) => {
        const w_arrows = this.stories[s].Waypoints[w].Arrows || [];
        const w_idx = w_arrows.map((_, a) => { 
          return ['waypoint-arrow', s, w, a];
        }).concat([['user-arrow', s, w, 0]]);
        return idx.concat(w_idx);
      }, []));
    }, []);
  },

  get allOverlays() {
    return this.stories.reduce((all, story, s) => {
      return all.concat(story.Waypoints.reduce((idx, _, w) => {
        const w_overlays = this.stories[s].Waypoints[w].Overlays || [];
        const w_idx = w_overlays.map((_, o) => { 
          return ['waypoint-overlay', s, w, o];
        }).concat([['user-overlay', s, w, 0]]);
        return idx.concat(w_idx);
      }, []));
    }, []);
  },

  isCurrentOverlay: function(el) {
    const substr = '-overlay-' + this.s + '-' + this.w;
    return el.includes(substr);
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

  addArrow: function(indices) {

    const [prefix, s_i, w_i, a_i] = indices;

    var a = {
      Point: this.a,
      Text: ''
    }
    if (prefix == 'waypoint-arrow') {
      a = Object.assign({}, this.stories[s_i].Waypoints[w_i].Arrows[a_i])
    }
    if (a.Angle == undefined) {
      a.Angle = 60;
    }
    const proto_text_el = "arrow-text";
    const proto_el = a.Arrowhead? "arrowhead-image" : "arrow-image";
    const text_el = "arrow-text-" + indices.join('-');
    const el = "arrow-image-" + indices.join('-');

    if (s_i != this.s || w_i != this.w) {
      a.Point = [-100, -100];
    }

    const current = this.viewer.getOverlayById(el);
    const xy = new OpenSeadragon.Point(a.Point[0], a.Point[1]);
    if (current) {
      current.update({
        location: xy,
      });
    }
    else {
      if (el != proto_el) {
        const proto_element = document.getElementById(proto_el);
        const element = proto_element.cloneNode(true);
        element.id = el;
        document.body.appendChild(element);
      }
      this.viewer.addOverlay({
        x: a.Point[0],
        y: a.Point[1],
        element: el,
        placement: OpenSeadragon.Placement.CENTER
      });
    }

    const current_text = this.viewer.getOverlayById(text_el);
    const xy_text = new OpenSeadragon.Point(a.Point[0], a.Point[1]);
    if (current_text) {
      current_text.update({
        location: xy_text,
      });
    }
    else {
      if (text_el != proto_text_el) {
        const proto_text_element = document.getElementById(proto_text_el);
        const text_element = proto_text_element.cloneNode(true);
        text_element.id = text_el;
        document.body.appendChild(text_element);
      }
      this.viewer.addOverlay({
        x: a.Point[0],
        y: a.Point[1],
        element: text_el,
        placement: OpenSeadragon.Placement.CENTER
      });
    }

    const a_image_el = $('#'+el);
    const a_svg_el = $('#'+el+' svg');
    const a_text_el = $('#'+text_el);
    const a_label_el = $('#'+text_el+' .arrow-label');
    const a_radius = a_svg_el[0].getAttribute('width') / 2;
    const a_y = a_radius * Math.sin(a.Angle * Math.PI /180);
    const a_x = a_radius * Math.cos(a.Angle * Math.PI /180);

    if (a.HideArrow == true) {
      a_image_el.css('display', 'none');
    }
    else {
      a_image_el.css('display', 'block');
      a_svg_el[0].setAttribute('transform', 
        'translate('+a_x+','+a_y+')rotate('+a.Angle+')');
      a_label_el.css('top', '100px');
    }

    const a_text = a.Text;
    
    if (a_text) {
      const t_w = a_text_el.width();
      const t_h = a_text_el.height();
      var t_x = 2 * a_x + t_w * Math.sign(Math.round(a_x)) / 2;
      var t_y = 2 * a_y + t_h * Math.sign(Math.round(a_y)) / 2;
      if (a.HideArrow == true) {
        t_x = 0;
        t_y = 0;
      }
      a_label_el.css('transform',
        'translate('+t_x+'px, '+t_y+'px)');
      a_label_el.addClass('p-3');
      a_label_el.text(a_text);
    }
    else {
      a_label_el.removeClass('p-3');
      a_label_el.text('');
    }
  },

  addOverlay: function(overlay, el) {

    const current = this.viewer.getOverlayById(el);

    if (this.waypoint.Mode != 'outline') {
      if (!this.isCurrentOverlay(el)) {
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

    var div = document.getElementById(el);

    if (!div) {
      div = document.createElement("div"); 
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
        width: overlay.width,
        height: overlay.height
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

    THIS = this;

    if (this.waypoint.Mode == 'outline') {
      const tracker = new OpenSeadragon.MouseTracker({
        element: document.getElementById(el),
        moveHandler: function(event) {
          $(div).css('cursor', 'pointer');
        },
        clickHandler: (function(event) {
          const [s, w] = el.split('-').slice(2);
          event.preventDefaultAction = false;
          this.s = s;
          this.w = w;
          this.pushState();
          window.onpopstate();
        }).bind(this)
      });
      this.trackers.push(tracker);
    }
  },

  addMasks: function() {
    $('#mask-layers').empty();
    if (this.edit || this.waypoint.Mode == 'explore') {
        $('#mask-layers').addClass('flex');
        $('#mask-layers').removeClass('flex-column');
    }
    else {
        $('#mask-layers').addClass('flex-column');
        $('#mask-layers').removeClass('flex');
    }
    const mask_names = this.waypoint.Masks || [];
    const masks = this.masks.filter(mask => {
      return mask_names.includes(mask.Name);
    });
    if (masks.length || this.edit) {
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
    
    // Update Mask Layer
    $(aEl).click(this, function(e) {
      const THIS = e.data;
      const group = THIS.design.default_group;
      const g = index_name(THIS.cgs, group);
      if ( g != -1 ) {
        THIS.g = g;
      }
      if (THIS.m.includes(m)){
        THIS.m = THIS.m.filter(i => i != m);
      }
      else {
        THIS.m.push(m);
      }
      THIS.pushState();
      window.onpopstate();
    });
  },

  addGroups: function() {
    $('#channel-groups').empty();
    $('#channel-groups-legend').empty();
    const cgs_names = this.waypoint.Groups || [];
    const cgs = this.cgs.filter(group => {
      return cgs_names.includes(group.Name);
    });
    if (cgs.length || this.edit) {
      $('#channel-label').show()
    }
    else {
      $('#channel-label').hide()
    }
    // Add some channel groups to waypoint
    cgs.forEach(function(group) {
      const g = index_name(this.cgs, group.Name);
      this.addGroup(group, g, 'channel-groups', false);
    }, this);
    // Add all channel groups to legend
    this.cgs.forEach(function(group) {
      const g = index_name(this.cgs, group.Name);
      this.addGroup(group, g, 'channel-groups-legend', true);
    }, this);
  },
  addGroup: function(group, g, el_id, show_more) {
    var aEl = document.createElement('a');
    var selected = this.g === g ? true : false;
    aEl = Object.assign(aEl, {
      className: selected ? 'nav-link active' : 'nav-link',
      style: 'padding-right: 40px;',
      href: 'javascript:;',
      innerText: group.Name,
      title: group.Path,
      id: group.Path + '_' + el_id,
    });
    aEl.setAttribute('data-toggle', 'pill');

    // Set story and waypoint for this marker
    var s_w = undefined;
    for (var s in THIS.stories) {
      for (var w in THIS.stories[s].Waypoints) {
        var waypoint = THIS.stories[s].Waypoints[w];  
        if (waypoint.Group == group.Name) {
          // Select the first waypoint or the definitive
          if (s_w == undefined || waypoint.DefineGroup) {
            s_w = [s, w];
          }
        }
      }
    }
    
    var moreEl = document.createElement('a');
    if (selected && show_more && s_w) {
      const opacity = 'opacity: ' +  + ';';
      moreEl = Object.assign(moreEl, {
        className : 'text-white',
        style: 'position: absolute; right: 10px;',
        href: 'javascript:;',
        innerText: 'MORE',
      });
      aEl.appendChild(moreEl);

      // Update Waypoint
      $(moreEl).click(this, function(e) {
        THIS = e.data;
        THIS.s = s_w[0];
        THIS.w = s_w[1];
        THIS.pushState();
        window.onpopstate();
      });
    }

    // Append everything
    document.getElementById(el_id).appendChild(aEl);
    
    // Update Channel Group
    $(aEl).click(this, function(e) {
      THIS = e.data;
      THIS.g = g;
      THIS.pushState();
      window.onpopstate();
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

    if (this.waypoint.Mode == 'outline') {
      var toc_label = document.createElement('p');
      toc_label.innerText = 'Table of Contents';
      items.appendChild(toc_label);
      // Add configured stories
      this.stories.forEach(function(story, sid) {
        if (story.Mode == undefined) {
          this.addStory(story, sid, items);
        }
      }, this);
    }

    const footer = document.createElement('p')
    const md = this.design.footer;
    footer.innerHTML = this.showdown.makeHtml(md);
    items.appendChild(footer);
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
      window.onpopstate();
    });

    wid_item.appendChild(wid_link);
    sid_list.appendChild(wid_item);
  },

  fillWaypointView: function() {
    const waypoint = this.waypoint;
    const wid_waypoint = document.getElementById('viewer-waypoint');
    const waypointName = document.getElementById("waypointName");
    const waypointCount = document.getElementById("waypointCount");

    if (this.currentCount != 1) {
      waypointCount.innerText = (this.currentCount - 1) + '/' + (this.totalCount - 1);
    }
    else {
      waypointCount.innerText = '';
    }

    waypointName.innerText = waypoint.Name;

    const scroll_dist = $('.waypoint-content').scrollTop();
    $(wid_waypoint).css('height', $(wid_waypoint).height());

    var md = waypoint.Description;

    cell_type_links_map.forEach(function(link, type){
      var re = RegExp(type+'s?', 'gi');
      md = md.replace(re, function(m) {
        return '['+m+']('+link+')';
      });
    });

    marker_links_map.forEach(function(link, marker){
      var re = RegExp('(^|[^0-9A-Za-z`])\('+marker+'\)([^0-9A-Za-z`]|$)', 'gi');
      md = md.replace(re, function(m, pre, m1, post) {
        return m.replace(m1, '`'+m1+'`', 'gi');
      });
    });

    marker_links_map.forEach(function(link, marker){
      var re = RegExp('`'+marker+'`', 'gi');
      md = md.replace(re, function(m) {
        return '['+m+']('+link+')';
      });
    });

    wid_waypoint.innerHTML = this.showdown.makeHtml(md);

    if (waypoint.Image) {
      var img = document.createElement("img");
      img.src = waypoint.Image;
      wid_waypoint.appendChild(img);
    }

    const allVis = ['VisMatrix', 'VisBarChart', 'VisScatterplot'];
    
    const waypointVis = new Set(allVis.filter(v => waypoint[v]));
    const renderedVis = new Set();

    const THIS = this;
    const finish_waypoint = function(visType) {
      renderedVis.add(visType);
      if ([...waypointVis].every(v => renderedVis.has(v))) {
        $('.waypoint-content').scrollTop(scroll_dist);
        $(wid_waypoint).css('height', '');
        THIS.colorMarkerText(wid_waypoint);
      }
    }

    const maskHandler = function(name) {
      const re = RegExp(name ,'gi');
      const m = index_regex(THIS.masks, re);
      if (m >= 0) {
        THIS.m = [m];
      }
      THIS.newView(true);
    }

    //VIS
    const renderVis = function(visType, el, id) {
      const renderer = {
        'VisMatrix': infovis.renderMatrix,
        'VisBarChart': infovis.renderBarChart,
        'VisScatterplot': infovis.renderScatterplot
      }[visType]
      const tmp = renderer(el, id, waypoint[visType], {
        'clickHandler': maskHandler
      });
      tmp.then(() => finish_waypoint(visType));
    }

    //some code to add text in between vis
    Array.from(waypointVis).forEach(function(visType) {
      const wid_code = Array.from(wid_waypoint.getElementsByTagName('code'));
      const el = wid_code.filter(code => code.innerText == visType)[0];
      const new_div = document.createElement('div');
      new_div.style.cssText = 'position:relative';
      new_div.id = visType;
      if (el) {
        $(el).replaceWith(new_div);
      }
      else {
        wid_waypoint.appendChild(new_div);
      }
      renderVis(visType, wid_waypoint, new_div.id);
    })

    finish_waypoint('');

  },
  colorMarkerText: function (wid_waypoint) {
    // Color code elements
    const channelOrders = this.channelOrders(this.channels);
    const wid_code = wid_waypoint.getElementsByTagName('code');
    for (var i = 0; i < wid_code.length; i ++) {
      var code = wid_code[i];
      var index = channelOrders[code.innerText];
      if (!index) {
        Object.keys(channelOrders).forEach(function (marker) {
          const c_text = code.innerText;
          const code_marker = marker_alias_map.get(c_text) || c_text;
          const key_marker = marker_alias_map.get(marker) || marker;
          const re = RegExp('^'+code_marker+'$','gi');
          if (key_marker != undefined && key_marker.match(re)) {
            index = channelOrders[marker];
          }
        });
      }
      var color = this.indexColor(index);
      var border = color? '2px solid ' + color: 'inherit';
      $(code).css('border-bottom', border);
    }
  },
  fillWaypointEdit: function() {
    
    const wid_waypoint = document.getElementById('viewer-waypoint');
    $(wid_waypoint).empty();
    const form_proto = document.getElementsByClassName('save_edits_form')[0]
    const form = form_proto.cloneNode(true);
    wid_waypoint.appendChild(form);

    const arrow_0 = this.waypoint.Arrows[0];
    if (arrow_0.HideArrow == true) {
       $('#edit_toggle_arrow').css('opacity', '0.5');
    }
    else {
       $('#edit_toggle_arrow').css('opacity', '1');
    }

    const wid_txt = $(wid_waypoint).find('.edit_text')[0];
    const wid_txt_name = $(wid_waypoint).find('.edit_name')[0];
    const wid_txt_arrow = $(wid_waypoint).find('.edit_arrow_text')[0];
    const wid_describe = decode(this.d);
    const wid_name = decode(this.n);

    $(wid_txt_arrow).on('input', this, function(e) {
      const THIS = e.data;
      THIS.waypoint.Arrows[0].Text = this.value;
      THIS.newView(false);
    });
    wid_txt_arrow.value = this.waypoint.Arrows[0].Text || '';

    $(wid_txt_name).on('input', this, function(e) {
      const THIS = e.data;
      THIS.n = encode(this.value);
      THIS.waypoint.Name = this.value;
    });
    wid_txt_name.value = wid_name;

    $(wid_txt).on('input', this, function(e) {
      const THIS = e.data;
      THIS.d = encode(this.value);
      THIS.waypoint.Description = this.value;
    });
    wid_txt.value = wid_describe;
  },

  get bufferYaml() {
    const viewport = this.viewport;
    const waypoint = this.waypoint;
    waypoint.Overlays = [this.overlay]; 
    waypoint.Name = decode(this.n);
    waypoint.Description = decode(this.d);

    const THIS = this;
    waypoint.ActiveMasks = this.m.filter(function(i){
      return i >= 0;
    }).map(function(i) {
      return THIS.masks[i].Name;
    })
    waypoint.Group = this.cgs[this.g].Name;
    waypoint.Pan = [viewport.pan.x, viewport.pan.y];
    waypoint.Zoom = viewport.scale;

    const wid_yaml = jsyaml.safeDump([[[waypoint]]], {
      lineWidth: 40,
      noCompatMode: true,
    });
    return wid_yaml.replace('- - - ', '    - ');
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

  const images = state.images;

  if (images.length == 1) {
    const imageName = document.getElementById('imageName');
    imageName.innerText = images[0].Description;
  }

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
    immediateRender: true,
    maxZoomPixelRatio: 10,
    visibilityRatio: .9
  });
  viewer.world.addHandler('add-item', function(addItemEvent) {
      const tiledImage = addItemEvent.item;
      tiledImage.addHandler('fully-loaded-change', function(fullyLoadedChangeEvent) {
          const fullyLoaded = fullyLoadedChangeEvent.fullyLoaded;
          if (fullyLoaded) {
            tiledImage.immediateRender = false;
          }
      });
      tiledImage.addHandler('opacity-change', function(opacityChangeEvent) {
          const opacity = opacityChangeEvent.opacity;
          if (opacity == 0) {
            tiledImage.immediateRender = true;
          }
      });
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

const index_regex = function(list, re) {
  if (!Array.isArray(list)) {
    return -1;
  }
  const item = list.filter(function(i) {
    return !!i.Name.match(re);
  })[0];
  return list.indexOf(item);
};
