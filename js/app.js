'use strict';

function HornedAnimal(hornedObject) {
  this.title = hornedObject.title;
  this.description = hornedObject.description;
  this.keyword = hornedObject.keyword;
  this.horns = hornedObject.horns;
  this.image_url = hornedObject.image_url;
}

const hornedArray = [];
const filterSet = new Set();

const readJson = () => {
  $.get('../json/page-1.json', 'json')
    .then(data => {
      data.forEach(horned => {
        hornedArray.push(new HornedAnimal(horned));
      });
    })
    .then(() => {
      hornedArray.forEach(element => $('#photo-gallery').append(pageRender(element)));
    })
    .then(() => {
      addSet(hornedArray);
    })
    .then(() => {
      filterSet.forEach(element => dropDownRender(element));
    });
  $.get('../json/page-2.json', 'json')
    .then(data => {
      data.forEach(horned => {
        hornedArray.push(new HornedAnimal(horned));
      });
    })
    .then(() => {
      hornedArray.forEach(element => $('#photo-gallery').append(pageRender(element)));
    })
    .then(() => {
      addSet(hornedArray);
    })
    .then(() => {
      filterSet.forEach(element => dropDownRender(element));
    });
};

const addSet = obj => {
  obj.forEach(element => filterSet.add(element.keyword));
};

console.log(filterSet);

const pageRender = obj => {
  const $source = $('#horn-template').html();
  // 2. Compile the source with Handlebars
  const compiledSource = Handlebars.compile($source);
  // 3. Return the HTML from the compile method
  return compiledSource(obj);
};

const dropDownRender = string => {
  $('select').append('<option class="dup"></option>');
  const $hornedDup = $('option[class="dup"]');
  $hornedDup.text(string);
  $hornedDup.removeClass('dup');
  $hornedDup.addClass(string);
};

$('select').on('change', function () {
  $('#photo-template')
    .siblings()
    .remove();
  hornedArray.forEach(element => {
    if (($('select').val()) === element.keyword) {
      pageRender(element)
    }
  })
});

$(() => readJson());