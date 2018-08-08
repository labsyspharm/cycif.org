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

const download = function(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const sort_keys = function(a, b){
  const getIndex = function(v){
    return [
      'Name',
      'Group',
      'Description',
      'Overlay',
      'Pan',
      'Zoom',
      'Style',
    ].indexOf(v);
  };
  return getIndex(a) > getIndex(b);
};

const ctrlC = function(str) {
  Clipboard.copy(str);
};

const newMarkers = function(tileSources, group) {
  for (var property in tileSources) {
    if (tileSources.hasOwnProperty(property)) {
      if (property === group.Path) {
        for (var i=0; i<tileSources[property].length; i++) {
          const tileSource = tileSources[property][i];
          tileSource.setOpacity(1);
        }
        $('#' + property).parent().addClass('active');
      } else {
        for (var i=0; i<tileSources[property].length; i++) {
          const tileSource = tileSources[property][i];
          tileSource.setOpacity(0);
        }
        $('#' + property).parent().removeClass('active');
      }
    }
  }
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
    setTimeout(function() {
      $(this).trigger('relabel', [copy_pre]);
    }, 1000);
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

  this.resetCount = 0;
  this.embedded = options.embedded || false;
  this.showdown = new showdown.Converter();
  this.tileSources = tileSources;
  this.exhibit = exhibit;
  this.viewer = viewer;
  viewer.setVisible(false);

  this.hashable = {
    exhibit: [
      's', 'w', 'g', 'v'
    ],
    edits: [
      's', 'w', 'g', 'v', 'o'
    ],
    tag: [
      'd', 'o', 'g', 'v'
    ]
  };
  this.searchable = {
    ui: [
      'edit'
    ],
  };

  this.state = {
    buffer: {
      waypoint: undefined
    },
    changed: false,
    design: {},
    w: [0],
    g: 0,
    s: 0,
    v: [1, 0.5, 0.5],
    o: [0, 0, 1, 1],
    name: '',
    description: '',
    mouseEvent: {},
    drawing: 0,
    editing: 0,
    edit: 0,
  };

  this.newExhibit();
};

HashState.prototype = {

  init: function() {
    // Read hash
    window.onpopstate = this.popState.bind(this);
    window.onpopstate();
    this.startEditing();
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
    $('#draw-switch').tooltip({
      title: 'Share Link'
    });

    $('#help').click(this, function(e) {
      const THIS = e.data;
      THIS.s = 0;
      THIS.pushState();
    });

    $('#edit-import').click(this, function(e) {
      $('#file-upload').click();
    });

    $('#file-upload').change(this, function(e) {
      const THIS = e.data;

      const f = e.target.files.item(0);
      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          const response = e.target.result;
          const config = jsyaml.safeLoad(response);
          THIS.exhibit = config.Exhibit;

          // Hard reset
          THIS.newExhibit();
          THIS.changed = true;
          THIS.cancelDrawing();
          THIS.cancelEditing();
          THIS.newOverlay();
          THIS.viewer.clearOverlays();
          THIS.viewer.world.removeAll();
          const init = function() {
            $('#help').click();
          };
          arrange_images(THIS.viewer, THIS.tileSources, THIS, init);
          $('#file-upload').replaceWith($('#file-upload').val('').clone(true));
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
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

    $('.clear-switch').click(this, function(e) {
      const THIS = e.data;
      THIS.bufferWaypoint = undefined;
      THIS.startEditing();
      THIS.pushState();
    });

    $('.draw-switch').click(this, function(e) {
      const THIS = e.data;
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
      const hash = THIS.makeHash(THIS.hashable.tag);
      const link = document.getElementById('copy_link');
      link.value = root + hash;

      return false;
    });

    this.viewer.addHandler('canvas-enter', function(e) {
      const THIS = e.userData;
      THIS.faster();
    }, this);

    this.viewer.addHandler('canvas-drag', function(e) {
      const THIS = e.userData;
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
      const position = THIS.normalize(e.position);
      if (THIS.drawing == 2) {
        e.preventDefaultAction = true;
        THIS.finishDrawing(position);
        THIS.pushState();
      }
    }, this);

    this.viewer.addHandler('canvas-click', function(e) {
      const THIS = e.userData;
      const overlay = $('#' + THIS.currentOverlay);
      const position = THIS.normalize(e.position);
      if (THIS.drawing == 1) {
        THIS.drawing = 2;
        e.preventDefaultAction = true;
        THIS.drawLowerBounds(position);
      }
      else if (THIS.drawing == 2) {
        e.preventDefaultAction = true;
        THIS.finishDrawing(position);
        THIS.pushState();
      }
    }, this);

    $(this.viewer.element).mousemove(this, function(e) {
      const THIS = e.data;
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
      const group = this.group;
      return {
        Zoom: viewport.scale,
        Pan: [
          viewport.pan.x,
          viewport.pan.y
        ],
        Group: group.Name,
        Description: '',
        Name: 'Untitled',
        Overlay: {
          x: -100,
          y: -100,
          width: 200,
          height: 200,
        },
      };
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
    const search = this.search;
    for (var k in this.searchable) {
      const keys = this.searchable[k];
      if (this.matchQuery(search, keys)) {
        return keys;
      }
    }
    return [];
  },

  get hashKeys() {
    const hash = this.hash;
    for (var k in this.hashable) {
      const keys = this.hashable[k];
      if (this.matchQuery(hash, keys)) {
        return keys;
      }
    }
    return [];
  },

  get isHash() {
    return !!this.hashKeys.length;
  },

  /*
   * Search Keys
   */

  get edit() {
    return this.state.edit;
  },
  set edit(_e) {
    const e = parseInt(_e, 10);
    this.state.edit = modulo(e, 2);
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
    this.g = gFromWaypoint(waypoint, this.cgs);
    this.v = vFromWaypoint(waypoint);
    this.o = oFromWaypoint(waypoint);
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
    if (this.s != s || !this.editing) {
      const waypoint = this.waypoint;
      this.d = dFromWaypoint(waypoint);
      this.n = nFromWaypoint(waypoint);
    }
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

  get yaml() {
    const config = {
      'Exhibit': {
         'Stories': this.stories,
         'Channels': this.chans,
         'Layout': this.layout,
         'Images': this.images,
         'Groups': this.cgs,
      }
    };
    return jsyaml.safeDump(config, {
      lineWidth: 60,
      sortKeys: sort_keys 
    });
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

  get story() {
    return this.stories[this.s];
  },
  set story(story) {
    const stories = this.stories;
    stories[this.s] = story;
    this.stories = stories;
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

  matchQuery: function(hash, hashKeys) {
    const keys = Object.keys(hash);
    if (keys.length != hashKeys.length) {
      return false;
    }
    return hashKeys.reduce(function(accept, key) {
      return accept && hash[key] !== undefined;
    }, true);
  },

  newExhibit: function() {
    const exhibit = this.exhibit;
    const cgs = deepCopy(exhibit.Groups || []);
    const stories = deepCopy(exhibit.Stories || []);
    this.design = {
      chans: deepCopy(exhibit.Channels || []),
      layout: deepCopy(exhibit.Layout || {}),
      images: deepCopy(exhibit.Images || []),
      stories: stories,
      cgs: cgs
    };
  },
  newTag: function() {
    const exhibit = this.exhibit;
    const stories = deepCopy(exhibit.Stories);
    const group = this.group;
    const o = this.o;
    const v = this.v;
    const d = this.d;
    this.stories = [{
      Description: '',
      Name: 'Tag',
      Waypoints: [{
        Zoom: v[0],
        Pan: v.slice(1),
        Group: group.Name,
        Description: decode(d),
        Name: 'Tag',
        Overlay: {
          x: o[0],
          y: o[1],
          width: o[2],
          height: o[3],
        },
      }]
    }].concat(stories);
  },
  pushState: function() {
    const hashKeys = this.hashable.edits;
    const searchKeys = this.searchKeys;
    const url = this.makeUrl(hashKeys, searchKeys);
    const title = document.title;
    const design = this.design;

    if (this.url == url && !this.changed) {
      return;
    }

    if (!this.embedded && this.hashKeys === hashKeys) {
      history.pushState(design, title, url);
    }
    else {
      // Replace any invalid state
      history.replaceState(design, title, url);
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
    const hashable = this.hashable;
    const hashKeys = this.hashKeys;
    const searchKeys = this.searchKeys;

    // Take search parameters
    searchKeys.forEach(function(key) {
      this[key] = search[key];
    }, this);

    // Accept valid hash
    hashKeys.forEach(function(key) {
      this[key] = hash[key];
    }, this);

    // Setup if invalid hash
    if (!this.isHash) {
      this.newExhibit();
      this.s = 0;
      this.g = 0;
      this.pushState();
    }

    // Do not persist tag in URL
    if (hashKeys === hashable.tag) {
      this.newTag();
      this.s = 0;
      this.g = 0;
      this.pushState();
      $('.modal').modal('hide');
    }

    // Always update
    this.newView(true);
  },
  newView: function(redraw) {

    // Temp overlay if drawing or editing
    if (this.drawing || this.editing) {
      this.addOverlay(this.overlay);
    }
    else {
      this.addOverlay(this.waypoint.Overlay);
    }

    // Redraw design
    if(redraw) {
      // Update OpenSeadragon
      this.activateViewport();
      newMarkers(this.tileSources, this.group);
      // Redraw HTML Menus
      this.addChannelLegends();
      this.addGroups();
      this.newStories();

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

    // Update text
    const v = this.v;
    const o = this.o;
    $('.edit_zoom').text(show5(v[0]));
    $('.edit_panx').text(show5(v[1]));
    $('.edit_pany').text(show5(v[2]));
    $('.edit_x').text(show5(o[0]));
    $('.edit_y').text(show5(o[1]));
    $('.edit_w').text(show5(o[2]));
    $('.edit_h').text(show5(o[3]));

    // Based on control keys
    const editing = this.editing;
    const drawing = this.drawing;

    // Based on search keys
    displayOrNot('#draw-switch a', !editing);
    displayOrNot('.show-if-viewing', !editing);
    displayOrNot('.show-if-edit', this.edit);
    activeOrNot('#view-switch', !editing);
    activeOrNot('#edit-switch', editing);
    displayOrNot('#story-nav', !editing);
    displayOrNot('.edit-item', editing);

    classOrNot('#story-nav', !editing, 'round-nav');
    classOrNot('#edit-menu', editing, 'round-nav');

    toggleCursor('crosshair', drawing);

    greenOrWhite('.draw-switch *', drawing);
    //greenOrWhite('#edit-switch *', editing);
  },

  makeUrl: function(hashKeys, searchKeys) {
    const root = this.location('pathname');
    const hash = this.makeHash(hashKeys);
    const search = this.makeSearch(searchKeys);
    return  root + search + hash;
  },

  makeHash: function(hashKeys, state) {
    if (state  == undefined) {
      state = this;
    }
    if (hashKeys == undefined) {
      hashKeys = this.hashKeys;
    }
    const hash = serialize(hashKeys, state, '#');
    return hash? '#' + hash : '';
  },

  makeSearch: function(searchKeys, state) {
    if (state  == undefined) {
      state = this;
    }
    if (searchKeys == undefined) {
      searchKeys = this.searchKeys;
    }
    const search = serialize(searchKeys, state, '&');
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
    this.d = dFromWaypoint(bw);
    this.n = nFromWaypoint(bw);
    this.g = gFromWaypoint(bw, this.cgs);
    this.editing = 1;
  },

  cancelEditing: function() {
    this.editing = 0;
  },

  finishEditing: function() {
    var changed = false;
    const cgs = this.cgs;
    const overlay = this.overlay;
    const viewport = this.viewport;
    const bw = this.bufferWaypoint;
    if (gFromWaypoint(bw, cgs) != this.g) {
      bw.Group = this.group.Name;
      changed = true;
    }
    if (nFromWaypoint(bw) != this.n) {
      bw.Name = decode(this.n);
      changed = true;
    }
    if (dFromWaypoint(bw) != this.d) {
      bw.Description = decode(this.d);
      changed = true;
    }
    if (!arrayEqual(oFromWaypoint(bw), this.o)) {
      bw.Overlay = this.overlay;
      changed = true;
    }
    if (!arrayEqual(vFromWaypoint(bw), this.v)) {
      bw.Zoom = viewport.scale;
      bw.Pan = [
        viewport.pan.x,
        viewport.pan.y
      ];
      changed = true;
    }
    if (changed) {
      this.bufferWaypoint = bw;
      this.pushState();
    }
    this.editing = 0;
  },

  startDrawing: function() {
    this.drawing = 1;
    const waypoint = this.waypoint;

    this.o = oFromWaypoint(waypoint);
  },
  cancelDrawing: function() {
    this.drawing = 0;

    const waypoint = this.waypoint;
    this.o = oFromWaypoint(waypoint);
  },

  finishDrawing: function(position) {

    this.drawUpperBounds(position);

    if (this.editing) {
      this.drawing = 0;
      this.finishEditing();
      this.startEditing();
      this.pushState();
    }
    else {
      const selector = '#edit_description_modal';
      window.setTimeout((function() {
        $(selector).modal('show');
        this.drawing = 0;
      }).bind(this), 300);
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

  get currentOverlay() {
    return 'current-overlay-' + this.resetCount;
  },

  newOverlay: function() {
    const oldOverlay = this.currentOverlay;
    this.resetCount += 1;
    const newOverlay = this.currentOverlay;
    const el = $("#" + oldOverlay).clone().prop({
      id: newOverlay
    });
    $("body").append(el);
  },
  /*
   * Display manaagement
   */

  addOverlay: function(overlay) {

    const el = this.currentOverlay;
    greenOrWhite('#' + el, this.drawing);
    const current = this.viewer.getOverlayById(el);
    const xy = new OpenSeadragon.Point(overlay.x, overlay.y);
    if (current) {
      current.update({
        location: xy,
        width: overlay.width,
        height: overlay.height,
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
  },

  addGroups: function() {
    $('#channel-groups').empty();
    this.cgs.forEach(this.addGroup, this);
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

    const story_indices = document.getElementById('story-indices');
    const story_elems = document.getElementById('story-content');

    const s0_item = document.getElementById('proto-story-index');
    const s0_story = document.getElementById('proto-story');

    // Remove existing stories
    clearChildren(story_indices);
    clearChildren(story_elems);

    // Add configured stories
    this.stories.forEach(function(story, sid, stories) {
      this.addStory(story, sid, {
        count: stories.length,
        story_indices: story_indices,
        story_elems: story_elems,
        s0_story: s0_story,
        s0_item: s0_item,
      });
    }, this);
  },

  addStory: function(story, sid, container) {

    var sid_label = 's-' + sid;

    // Copy the index
    var sid_item = container.s0_item.cloneNode(true);
    var sid_index = sid_item.children[0];

    sid_index.setAttribute('aria-controls', sid_label);
    sid_index.innerText = story.Name;
    sid_index.href = '#' + sid_label;
    sid_index.id = '-' + sid_label;

    // Copy the story
    var sid_story = container.s0_story.cloneNode(true);

    sid_story.setAttribute('aria-labeledby', sid_index.id);
    sid_story.id = sid_index.getAttribute('aria-controls');
    $(sid_item).removeAttr('id');

    // Activated
    if (sid == this.s) {
      $(sid_index).addClass('active');
      $(sid_story).addClass('active show');
    }
    else {
      $(sid_index).removeClass('active');
      $(sid_story).removeClass('active show');
    }
    // Update Story
    $(sid_index).click(this, function(e) {
      const THIS = e.data;
      THIS.s = sid;
      THIS.pushState();
    });
    // Editing state drives waypoint rendering
    const editing = this.editing;

    // Remove default waypoint index
    const waypoint_indices = sid_story.getElementsByClassName('waypoint-indices')[0];
    const w0_index = waypoint_indices.children[0];
    $(waypoint_indices).empty();

    // Remove default waypoint
    const waypoint_elems = sid_story.getElementsByClassName('waypoint-content')[0];
    const w0_waypoint = waypoint_elems.children[editing];
    $(waypoint_elems).empty();

    // Remove vertical bar
    if (story.Waypoints.length < 2 || this.editing) {
      $(sid_story).find('.if-many-waypoint').remove();
    }

    // Add configured waypoints
    story.Waypoints.forEach(function(waypoint, wid, waypoints) {
      this.addWaypoint(waypoint, wid, {
        count: waypoints.length,
        waypoint_indices: waypoint_indices,
        waypoint_elems: waypoint_elems,
        w0_waypoint: w0_waypoint,
        w0_index: w0_index,
        label: sid_label,
        editing: editing,
      });
    }, this);

    // Add index, Add story
    if (container.count > 1 && !this.editing) {
      container.story_indices.appendChild(sid_item);
    }
    container.story_elems.appendChild(sid_story);
  },

  addWaypoint: function(waypoint, wid, container) {
    const wid_label = container.label + '-w-' + wid;

    // Copy the index
    const wid_index = container.w0_index.cloneNode(true);
    const wid_span = $(wid_index).find('.index-span')[0];
    const wid_icon = $(wid_index).find('.inset-icon')[0];
    wid_span.innerText = waypoint.Name;

    wid_index.href = '#' + wid_label;
    wid_index.id = '-' + wid_label;

    // Copy the waypoint
    const wid_waypoint = container.w0_waypoint.cloneNode(true);
    wid_waypoint.id = wid_label;

    // Fill waypoint based on edit mode
    const editing = container.editing;

    // Activated
    if (wid == this.w) {
      wid_index.className += ' active';
      wid_waypoint.className += ' active show';
    }
    displayOrNot(wid_icon, this.edit);

    // Interactive
    if (editing == 0) {
      this.fillWaypointView(waypoint, wid_waypoint);
    }
    else if (editing == 1) {
      this.fillWaypointEdit(wid_waypoint);
    }

    // Update Waypoint
    $(wid_index).click(this, function(e) {
      const THIS = e.data;
      THIS.w = wid;
      const waypoint = THIS.waypoint;
      THIS.d = dFromWaypoint(waypoint);
      THIS.n = nFromWaypoint(waypoint);
      THIS.pushState();
    });

    // Edit Waypoint
    $(wid_icon).click(this, function(e) {
      const THIS = e.data;
      THIS.w = wid;
      const waypoint = THIS.waypoint;
      THIS.startEditing(waypoint);
    });

    // Add index, Add waypoint
    const indices = container.waypoint_indices;
    if (container.count > 1 && !this.editing) {
      indices.appendChild(wid_index);
    }
    container.waypoint_elems.appendChild(wid_waypoint);
  },

  fillWaypointView: function(waypoint, wid_waypoint) {
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
  fillWaypointEdit: function(wid_waypoint) {
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
    waypoint.Description = decode(this.d);
    waypoint.Group = this.cgs[this.g].Name;
    waypoint.Pan = [viewport.pan.x, viewport.pan.y];
    waypoint.Zoom = viewport.scale;

    const wid_yaml = jsyaml.safeDump([[waypoint]], {
      lineWidth: 40,
      sortKeys: sort_keys 
    });
    return wid_yaml.replace('- ', '  ');
  },

  arrange: function(grid) {
    const out = grid.map(function(row) {
      return row.map(function(col) {
        return {};
      });
    });
    const numRows = grid.length;
    const numColumns = grid[0].length;
    const nTotal = numRows * numColumns;

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
        out[yi][xi] = {
          x0: x,
          y0: y,
          x1: x + displayWidth,
          y1: y + displayHeight,
        };
      }
    }
    return out;
  },

  rearrange: function() {

    const now = this.arrange(this.grid);
    const next = this.arrange(this.target);

    const now_end = now.slice(-1)[0].slice(-1)[0];
    const next_end = next.slice(-1)[0].slice(-1)[0];

    const now_ratio = now_end.y1 / now_end.x1;
    const next_ratio = next_end.y1 / next_end.x1;

    console.log(now_ratio);
    console.log(next_ratio);
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


const getGetTileUrl = function(image, group, channelSettings) {

  const getJpegTile = function(level, x, y) {
    return image.Path + '/' + group.Path + '/' + (image.MaxLevel - level) + '_' + x + '_' + y + '.jpg';
  };

  if (image.Provider != 'minerva') {
    return getJpegTile; 
  }

  const colors = group.Colors;
  const channels = group.Channels;

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

  const cg = state.g;
  const cgs = state.cgs;
  const grid = state.grid;

  const numRows = grid.length;
  const numColumns = grid[0].length;

  const nTotal = numRows * numColumns * cgs.length;
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

      for (var j=0; j < cgs.length; j++) {
        const group = cgs[j];
        const channelSettings = state.channelSettings(group.Channels);
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
              getTileUrl: getGetTileUrl(image, group, channelSettings)
            },
            x: x,
            y: y,
            width: displayWidth,
            opacity: group === cgs[cg] ? 1 : 0,
            //preload: true,
            success: function(data) {
              const item = data.item;
              if (!tileSources.hasOwnProperty(group.Path)) {
                tileSources[group.Path] = [];
              }
              tileSources[group.Path].push(item);

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
  });
  const tileSources = {};
  const state = new HashState(viewer, tileSources, exhibit, options);
  const init = state.init.bind(state);
  arrange_images(viewer, tileSources, state, init);
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

