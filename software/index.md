---
title: Software
redirect_to:
  - http://tissue-atlas.org/software
---
## Software solutions for CyCIF and beyond
We develop opensource software to tackle common challenges imposed by the highly-multiplexed whole slide imaging.

### [Minerva]({{ site.baseurl }}/software/minerva)
Minerva is a suite of software tools for interpreting and interacting with complex images, organized around a guided analysis approach. The software enables fast sharing of large image data that is stored on Amazon S3 and viewed using a zoomable image viewer implemented using [OpenSeadragon](https://openseadragon.github.io/){:target="_blank"}, making it ideal for integration into multi-omic browsers for data dissemination of tissue atlases. Check out the [Minerva Wiki](https://github.com/labsyspharm/minerva-story/wiki){:target="_blank"} to learn more about the software and for news.

[Learn More]({{ site.baseurl }}/software/minerva){:class="btn btn-outline-primary m-1"}
[Publication](https://www.biorxiv.org/content/10.1101/2020.03.27.001834v2){:class="btn btn-outline-primary m-1"}
[Source Code](https://github.com/labsyspharm/minerva-story){:class="btn btn-outline-primary m-1"}
[Documentation](https://github.com/labsyspharm/minerva-story/wiki){:class="btn btn-outline-primary m-1"}

---

### ASHLAR
ASHLAR (Alignment by Simultaneous Harmonization of Layer/Adjacency Registration) is Python tool for image registration and stitching that is more rapid and accurate than existing methods in assembling subcellular-resolution, multi-channel images up to several square centimeters in size. ASHLAR uses Bioformats software to read virtually any microscope image files and write the OME-TIFF format files.

[Source Code](https://github.com/labsyspharm/ashlar){:class="btn btn-outline-primary m-1"}

---

### MCMICRO
MCMICRO is the end-to-end processing pipeline for multiplexed whole tissue imaging and tissue microarrays. It comprises stitching and registration, segmentation, and single-cell feature extraction. Each step of the pipeline is containerized to enable portable deployment across an array of compute environments, including local machines, job-scheduling clusters and cloud environments like AWS. The pipeline execution is implemented in Nextflow, a workflow language that facilitates caching of partial results, dynamic restarts, extensive logging and resource usage reports.

[Publication](https://www.biorxiv.org/content/10.1101/2021.03.15.435473v1){:class="btn btn-outline-primary m-1"}
[Source Code](https://github.com/labsyspharm/mcmicro){:class="btn btn-outline-primary m-1"}
[Documentation](https://mcmicro.org){:class="btn btn-outline-primary m-1"}
