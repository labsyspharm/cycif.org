strip = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

get_links_alias = function(data) {

    data = data.map(function(d) {
      if (d["﻿String"]) {
        d.String = d["﻿String"];
      }
      return d;
    })

    const alias_map = new Map();
    data.filter(d => d.Alias).forEach(function(d) {
      d.Alias.split(',').forEach(function(a) {
        alias_map.set(strip(a), strip(d.String));
      });
    });

    const links_map = new Map();
    data.filter(d => d.Link).forEach(function(d) {
      if (d.Alias) {
        d.Alias.split(',').forEach(function(a) {
          links_map.set(strip(a), strip(d.Link));
        }); 
      }
      links_map.set(strip(d.String), strip(d.Link));
    });

    return [links_map, alias_map];
}
