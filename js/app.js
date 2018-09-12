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
      hornedArray.forEach(element => pageRender(element));
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
  $('main').append('<section class="clone"></section>');
  const $hornedClone = $('section[class="clone"]');
  const $hornHtml = $('#photo-template').html();
  $hornedClone.html($hornHtml);

  $hornedClone.find('h2').text(obj.title);
  $hornedClone.find('img').attr('src', obj.image_url);
  $hornedClone.find('p').text(obj.description);
  $hornedClone.removeClass('clone');
  $hornedClone.addClass(obj.title);
};

const dropDownRender = string => {
  $('select').append('<option class="dup"></option>');
  const $hornedDup = $('option[class="dup"]');
  $hornedDup.text(string);
  $hornedDup.removeClass('dup');
  $hornedDup.addClass(string);
};

$('button[name=clear]').on('click', function() {
  $('.log-item:first')
    .siblings()
    .remove();
});

$(() => readJson());
