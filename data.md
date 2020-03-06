---
title: Data
layout: data
---
<h2 class="h2">
  Visualizing and sharing CyCIF images
</h2>
<p class="">
  For a ~10 x 11mm tissue FFPE specimen under 20X objective, each cycle of t-CyCIF generates around 160 individual
  image tiles.
  The assembly process involves stitching sequential image tiles from a single t-CyCIF cycle into one large image
  panel,
  flat-fielding to correct for uneven illumination and registration of images from successive t-CyCIF cycles to each
  other;
  these procedures were performed using
  <a href="https://fiji.sc/" target="_blank">ImageJ</a>,
  <a href="https://github.com/sorgerlab/ashlar" target="_blank">ASHLAR</a>, and
  <a href="https://www.nature.com/articles/ncomms14836" target="_blank">BaSiC software</a>.
</p>
<p class="mb-5">
  The stitched images are stored on
  <a href="https://aws.amazon.com/s3/" target="_blank">Amazon S3</a> and the zoomable image viewer implemented using
  <a href="https://openseadragon.github.io/" target="_blank">OpenSeaDragon</a>.
</p>

<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/cycifviewer/pca-2019.jpg" alt="Generic placeholder image">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/data/pca-2019/">
      <h5 class="mt-0">Melanoma Pre-Cancer Atlas (HTAN)</h5>
    </a>
    <p>
      Unpublished t-CyCIF images of melanoma and precursor fields from two patients. The specimen from patient 1 illustrates different regions of melanoma progression from relatively normal melanocytes to precursor melanocytic dysplasia to invasive melanoma. In addition, the specimen shows different regions representing immune responses to early melanoma (inflammatory regression) as well as to invasive melanoma in the form of a brisk immune infiltrative immune response (tumor infiltrating lymphocytes “TILs”). The excision specimen from patient 2 illustrates the histologic evolution of melanoma from a precursor field to melanoma in situ, and ultimately to polypoidal invasive melanoma.
    </p>
  </div>
</div>

<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/cycifviewer/01_melanoma_story.jpg" alt="Generic placeholder image">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/osd-exhibit" class="">
      <h5 class="mt-0">Tour of the melanoma dataset</h5>
    </a>
    <p>
      The unpublished 13-plex t-CyCIF images of tissue specimens from four patients with BRAF-mutant metastatic
      melanoma resected
      before (left) and after (right) treatment with BRAF and MEK inhibitors (dabrafenib/trametinib). Each image is
      composed
      of 150-200 image tiles at a nominal resolution of ~0.9 μm.
    </p>
  </div>
</div>

<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/cycifviewer/02_square_elife_paper.jpg" alt="Generic placeholder image">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/publications#lin-elife-2018-paper">
      <h5 class="mt-0">Figures in the 2018 eLife Publication</h5>
    </a>
    <p>
      Tissue-based cyclic immunofluorescent microscopy (t-CyCIF) is a simple method for generating highly multiplexed
      optical images
      from formalin-fixed paraffin-embedded (FFPE) tissue samples routinely used for histopathological diagnosis of
      human
      disease. The method is based on previously described single-cell imaging approaches and readily implemented on
      existing
      instruments (Gerdes et al. 2013, Lin et al. 2015, 2016).
    </p>
  </div>
</div>

<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/cycifviewer/03_gaglia.jpg" alt="HFS1">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/featured-paper/gaglia-2018/figures/osd-COLON_1">
      <h5 class="mt-0">Gaglia et al., 2018 (submitted)</h5>
    </a>
    <p>
			<a href="https://www.synapse.org/#!Synapse:syn20505972/wiki/594014">
			Access Raw Data
			</a>
    </p>
  </div>
</div>
<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/du-lin-rashid-2019/tonsil_1.jpg" alt="nat_prot">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/featured-paper/du-lin-rashid-2019/figures/">
      <h5 class="mt-0">Du, Lin, and Rashid et al., Nature Protocols, 2019</h5>
    </a>
    <p>

    </p>
  </div>
</div>
<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/liu-2019/cover.jpg" alt="nat_medicine">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/data/liu-lin-2019/">
      <h5 class="mt-0">Liu and Lin et al., 2019 (submitted)</h5>
    </a>
    <p>

    </p>
  </div>
</div>
<div class="row mb-4">
  <div class="col-md-2">
    <img class="img-fluid mb-3 w-100" src="{{ site.baseurl }}/assets/img/mehta-2020/cover.jpg" alt="nat_medicine">
  </div>
  <div class="col">
    <a href="{{ site.baseurl }}/data/mehta-2020/">
      <h5 class="mt-0">Mehta et al., 2020 (submitted)</h5>
    </a>
    <p>

    </p>
  </div>
</div>
