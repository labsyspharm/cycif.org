const cell_type_links_csv = `String,Alias,Link
Natural Killer Cells,,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/natural-killer-cells
B Cells,,https://www.immunology.org/public-information/bitesized-immunology/cells/b-cells
Basophil,,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/basophils
Helper T cell,CD4+ T Cell,https://www.immunology.org/public-information/bitesized-immunology/células/cd4-t-cells
Cytotoxic T Cell,CD8+ T Cell,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/cd8-t-cells
Dendritic Cell,,https://www.immunology.org/public-information/bitesized-immunology/cells/dendritic-cells
Eosinophils,,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/eosinophils
Macrophage,,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/macrophages
Mast Cell,,https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/mast-cells
Neutrophil,,https://www.immunology.org/public-information/bitesized-immunology/cells/neutrophils
Regulatory T Cell,Treg,https://www.immunology.org/public-information/bitesized-immunology/células/regulatory-t-cells-tregs
T follicular helper cell,,https://www.immunology.org/public-information/bitesized-immunology/cells/t-follicular-helper-cells
bone marrow,,https://www.immunology.org/public-information/bitesized-immunology/%C3%B3rganos-y-tejidos/bone-marrow
lymph node,,https://www.immunology.org/public-information/bitesized-immunology/organs-and-tissues/lymph-node
complement system,,https://www.immunology.org/public-information/bitesized-immunology/sistemas-y-procesos/complement-system
phagocytosis,,https://www.immunology.org/public-information/bitesized-immunology/systems-and-processes/phagocytosis
`;

function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

const cell_type_links_data = $.csv.toObjects(cell_type_links_csv);

const cell_type_alias_map = new Map();
cell_type_links_data.filter(d => d.Alias).forEach(function(d) {
  d.Alias.split(',').forEach(function(a) {
    cell_type_alias_map.set(strip(a), strip(d.String));
  });
});

const cell_type_links_map = new Map();
cell_type_links_data.filter(d => d.Link).forEach(function(d) {
  if (d.Alias) {
    d.Alias.split(',').forEach(function(a) {
      cell_type_links_map.set(strip(a), strip(d.Link));
    }); 
  }
  cell_type_links_map.set(strip(d.String), strip(d.Link));
});
