## t-CyCIF
### Tissue-based cyclic immunofluorescence

* Works with a wide range of FFPE human and mouse tumors and tissues.
* Up to 60-plex imaging of some tissue &mdash; compatible with H&E in final
  round.
* Uses conventional wide-field, confocal and super-resolution microscopes.
* Antibodies can be selected based on the requirements of the project: no
  proprietary or unusual reagents required.

t-CyCIF is a method for highly multiplexed immunofluorescence imaging of
formalin-fixed, paraffin-embedded (FFPE) specimens mounted on glass slides, the
most widely used specimens for histopathological diagnosis of cancer and other
diseases. A related CyCIF method is used to image cells grown in culture (see
publications). t-CyCIF generates up to 60-plex images using an iterative process
(a cycle) in which conventional low-plex fluorescence images are repeatedly
collected from the same sample and then assembled into a high dimensional
representation.

<div class="embed-container">
    <iframe width="900" height="506" src="https://player.vimeo.com/video/269885646"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

t-CyCIF requires no specialized instruments or reagents and is compatible with
super-resolution imaging. We have shown that t-CyCIF can be used to quantify
signal transduction cascades, measure the levels of tumor antigens and determine
immunophenotypes using immune cell lineage markers. The key features of t-CyCIF
are that it is simple to implement on existing microscopes, it requires no
special or proprietary reagents and antibodies can be combined as needed to
investigate specific questions.

[View the dynamic melanoma patient sample browser!](http://pca2018.s3-website-us-east-1.amazonaws.com/)

### The t-CyCIF Process

In t-CyCIF, ~5 µm thick are cut from FFPE blocks, the standard in most
histopathology services, followed be dewaxing and antigen retrieval in the usual
manner; to reduce auto-fluorescence a cycle of “pre-staining” is performed.
Subsequent t-CyCIF cycles each involve four steps (Figure 1): (i)
immuno-staining with antibodies against protein antigens (three antigens per
cycle in the implementation described here) (ii) staining with a DNA dye
(commonly Hoechst 33342) to mark nuclei and facilitate image registration across
cycles (iii) four-channel imaging at low and high magnifications (iv)
fluorophore bleaching followed by a wash step and then another round of
immuno-staining. The signal-to-noise ratio often increases with cycle number.
When no more t-CyCIF cycles are to be performed, the specimen is stained with
H&E to enable conventional histopathology review. Individual image panels are
stitched together and registered across cycles followed by image processing and
segmentation to identify cells and other structures.

### Imaging

Imaging of t-CyCIF specimens can be performed on a variety of fluorescent
microscopes each of which represent a different tradeoff between data
acquisition time, image resolution and sensitivity (Figure 2). Specimens several
square centimeters in area are often examined at a resolution of ~1 µm on slide
scanners, but high resolution image is obtained using confocal or structured
illumination microscopes.

### Antibodies

A wide variety of antibodies have been tested for use in t-CyCIF (Table 1). To
date we have compared patterns of t-CyCIF staining with previously published
immuno-histochemistry data but have not performed additional validation. Such
validation is currently underway for specific tissue and tumor types.

In the first cycle of t-CyCIF is possible to use indirect immunofluorescence and
secondary antibodies. In all other cycles antibodies are directly conjugated to
fluorophores, typically Alexa 488, 555 or 647. As an alternative to chemical
coupling we have tested the Zenon™ antibody labelling method from ThermoFisher
in which isotype-specific Fab fragments pre-labelled with fluorophores are bound
to primary antibodies to create immune complexes; the immune complexes are then
incubated with tissue samples. This method is effective with some but not all
primary antibodies that we have tested.

### Image processing and data analysis

Image processing and data analysis are demanding in the case of high-plex tissue
images; we use software tools developed by others supplemented by a growing
number of specialized methods (code can be found
at [our GitHub repository](https://github.com/sorgerlab/). Once cells are
segmented and turned into intensity information, tools such as t-SNE can be used
in much the same way as with mass cytometry and other high-dimensional data.

### Publications

1. Gerdes MJ, Sevinsky CJ, Sood A, Adak S, Bello MO, Bordwell A, Can A, Corwin
   A, Dinn S, Filkins RJ, Hollman D, Kamath V, Kaanumalle S, Kenny K, Larsen M,
   Lazare M, Li Q, Lowes C, McCulloch CC, McDonough E, Montalto MC, Pang Z,
   Rittscher J, Santamaria-Pang A, Sarachan BD, Seel ML, Seppo A, Shaikh K, Sui
   Y, Zhang J, Ginty F. Highly multiplexed single-cell analysis of
   formalin-fixed, paraffin-embedded cancer tissue. Proc Natl Acad Sci U S A.
   2013 Jul 16;110(29):11982-11987. PMCID: PMC3718135

1. Lin J-R, Fallahi-Sichani M, Sorger PK. Highly multiplexed imaging of single
   cells using a high-throughput cyclic immunofluorescence method. Nat Commun.
   2015 Sep 24;6:8390. PMCID: PMC4587398

1. Lin J-R, Fallahi-Sichani M, Chen J-Y, Sorger PK. Cyclic Immunofluorescence
   (CycIF), A Highly Multiplexed Method for Single-cell Imaging. Curr Protoc
   Chem Biol. 2016 Dec 7;8(4):251-264. PMCID: PMC5233430

1. Lin J-R, Izar B, Mei S, Wang S, Shah P, Sorger P. A simple open-source method
   for highly multiplexed imaging of single cells in tissues and tumours.
   bioRxiv. 2017 Jun 19;151738.

1. Coy S, Rashid R, Lin J-R, Du Z, Donson AM, Hankinson TC, Foreman NK, Manley
   PE, Kieran MW, Reardon DA, Sorger PK, Santagata S. Multiplexed
   Immunofluorescence Reveals Potential PD-1/PD-L1 Pathway Vulnerabilities in
   Craniopharyngioma. Neuro-Oncol. 2018 Mar 2; PMID: 29509940
