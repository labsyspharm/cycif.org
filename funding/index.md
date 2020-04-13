---
title: Funding
grants: 
    - name: Center for Pre-cancer Atlases of Cutaneous and Hematologic Origin (PATCH)
      link: patch
      short-name: PATCH
      project-image: 
      # nci_case_logo_314056_284_5_v1-1200x600.jpg
      excerpt: The HMS PATCH Center is a component of the National Cancer Institute Human Tumor Atlas Network (HTAN), a multi-center program within the National Cancer Institute that emerged from the Beau Biden Cancer Moonshot Initiative.
      funding: NCI Human Tumor Atlas Network grant U2C-CA233262
      funding-image: funding/nci-color.png
    - name: Ludwig Tumor Atlas
      link: ludwig-tumor-atlas
      short-name: Ludwig Tumor Atalas
      project-image:
      excerpt: The Ludwig Tumor Atlas is a wide-ranging collaborative project involving members of the Ludwig Center at Harvard Medical School and Ludwig Cancer Research Centers elsewhere in the U.S. and Europe. 
      funding: Ludwig Center at Harvard Medical School and the Ludwig Cancer Research Foundation
      funding-image: funding/ludwig.png
    - name: Center for Cancer Systems Pharmacology
      link: ccsp
      short-name: CCSP
      project-image: funding/logo-ccsp-stacked.svg
      excerpt: The HMS Center for Cancer Systems Pharmacology (CCSP) is an NCI Cancer Systems Biology Center of Excellence that studies responsiveness and resistance to anti-cancer drugs. 
      funding: NCI Cancer Systems Biology Center of Excellence grant U54-CA225088
      funding-image: funding/nci-color.png
    - name: Omic and Multidimensional Spatial (OMS) Atlas
      link: oms-atlas
      short-name: OMS Atlas
      project-image: funding/ohsu-color.png
      excerpt: The OMS Atlas Center based at the Oregon Health Sciences University (OHSU) and led by Joe Gray is a component of the National Cancer Institute Human Tumor Atlas Network (HTAN), a multi-center program within the National Cancer Institute that emerged from the Beau Biden Cancer Moonshot Initiative.
      funding: NCI Human Tumor Atlas Network grant U2C-CA233280
      funding-image: funding/nci-color.png
---
{% for grant in page.grants %}
<div class="row mb-5">
  <div class="d-none col-2 d-md-flex align-items-center justify-content-center">
    {% if grant['project-image'] %}
    <img src="{{ site.baseurl }}/assets/img/{{ grant['project-image'] }}" alt="" class="img-fluid">
    {% else %}
    <h3 class="m-0 text-center">{{ grant['short-name'] }}</h3>
    {% endif %}
  </div>
  <div class="col">
    <a href="{{ grant['link'] }}">
      <h4 class='mt-0 mb-4'>
          {{ grant['name'] }}
      </h4>
    </a>
    <p>{{ grant['excerpt'] }}</p>
  </div>
  <div class="col-md-3">
        <h5 class='m-0 mb-4'>
          Funded By:
        </h5>
        <p>{{ grant['funding'] }}</p>
        <img src="{{ site.baseurl }}/assets/img/{{ grant['funding-image'] }}" alt="" class="img-fluid" style="max-height: 32px">
    </div>
</div>
{% endfor %}