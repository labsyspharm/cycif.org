---
redirect_from: /pca2018/
active: home
title: CyCIF - Cyclic Immunofluorescence
---

<!-- <p class="sidebar-cta">
    <a href="http://pca2018.s3-website-us-east-1.amazonaws.com/">
        View the dynamic melanoma patient sample browser!

        <img class="cta-button"
             src="{{ "/assets/img/cta_button.png" | absolute_url }}"
             alt="Browse">
    </a>
</p> -->
<div class="row py-3">
    <div class="col-md-6 d-flex-colume    my-4 pb-md-5">
        <h2 class="h1">Simple, flexible and robust</h2>
        CyCIF is a robust and inexpensive method for highly multiplexed immunofluorescence imaging using standard instruments and reagents. The concept of repeatedly staining and imaging slides has been around for many years and most commonly involves antibody stripping using denaturants. <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3718135/" target="_blank">Gerdes et al (2013)</a> described an approach in which fluorophores are chemically activated after each of several rounds of immunofluorescence. The t-CyCIF method by <a href="{{ site.baseurl }}/method">Lin et al (2018)</a> builds on this and related approaches. The rich data collected using CyCIF are also amenable to state-of-the-art, high-dimensionality analysis tools developed for CyTOF, including <a href="http://www.jmlr.org/papers/v9/vandermaaten08a.html" target="_blank">tSNE</a> , <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4076922/" target="_blank">viSNE</a> and <a href="https://www.ncbi.nlm.nih.gov/pubmed/24766814" target="_blank">Wanderlust</a>. These allow investigation of complex associations and interdependencies between observed features and phenotypes.
    </div>
    <div class="col-md-6  d-flex align-items-center my-4 pb-md-5">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/269885646" mozallowfullscreen allowfullscreen></iframe>
        </div>
    </div>
</div>

<hr>

<div class="row py-3">
    <div class="col-md-6 d-flex-colume    my-4 pb-md-5">
        <h2 class="h1">Tumor ecosystem in its preserved architecture</h2>
        t-CyCIF (Tissue-based cyclic immunofluorescence) can be used to quantify
        signal transduction cascades, measure the levels of tumor antigens and determine
        immunophenotypes using immune cell lineage markers. t-CyCIF is a powerful tool 
        to study drug resistance of immunotherapy in different patients.
    </div>
    <div class="col-md-6  d-flex align-items-center my-4 pb-md-5">
        <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/270692465" mozallowfullscreen allowfullscreen></iframe>
        </div>
    </div>
</div>

<hr>

<div class="row py-3">
    <div class="col-md-6 d-flex flex-column justify-content-start   my-4">
        <h2 class="h1 bd-highlight">t-CyCIF</h2>
        <p>
            t-CyCIF (Tissue-based cyclic immunofluorescence) uses <a href="https://en.wikipedia.org/wiki/Histology">formalin-fixed, paraffin-embedded (FFPE)</a> tumor and tissue specimens mounted on glass slides. These are the most widely used specimens for histopathological diagnosis of cancer and other diseases. t-CyCIF generates multiplexed images of FFPE samples using an iterative process (a cycle) in which conventional low-plex fluorescence images are repeatedly collected from the same sample and then assembled into a high dimensional representation. Several variants are possible using direct and indirect immunofluorescence.
        </p>
        
    </div>
    <div class="col-md-6 d-flex align-items-center my-4 pb-md-5">
        <div class="embed-responsive embed-responsive-1by1">
            <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/269904895"></iframe>
        </div>
    </div>
</div>
<div class="row py-3">
    <div class="col col-md-6">
        <h3 class="h2 bd-highlight">Key features of t-CyCIF</h3>
        <ul>
            <li>Works with a wide range of FFPE human and mouse tumors and tissues.</li>
            <li>Up to 60-plex imaging of some tissues &mdash; compatible with H&amp;E in final
                    round.</li>
            <li>Uses conventional wide-field, confocal and super-resolution microscopes.</li>
            <li>Antibodies can be selected based on the requirements of the project: no
                    proprietary or unusual reagents required.</li>
        </ul>
    </div>
    <div class=" col-md-4 offset-md-1">
            <h3 class="h2 bd-highlight">Explore t-CyCIF</h3>
        <div class="d-flex flex-column flex-wrap justify-content-center">
            <a href="{{ site.baseurl }}/method" class="btn btn-outline-primary m-2">Method</a>
            <a href="http://lincs.hms.harvard.edu/lin-elife-2018/" target="_blank" class="btn btn-outline-primary m-2">Data &amp; code</a>
            <a href="{{ site.baseurl }}/publications" class="btn btn-outline-primary m-2">Publications</a>
            <a href="{{ site.baseurl }}/cycifviewer" class="btn btn-primary m-2">CyCIF Viewer</a>
        </div>
    </div>
</div>
