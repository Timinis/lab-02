'use strict';

function HornedAnimal(hornedObject) {
  this.title = hornedObject.title;
  this.description = hornedObject.description;
  this.keyword = hornedObject.keyword;
  this.horns = hornedObject.horns;
  this.image_url = hornedObject.image_url;
}

let hornedArray = [];
const filterSet = new Set();
let nameSortCheck = false;
let hornSortCheck = false;
let tempSortArray = [];


const readJson = () => {
  $.get('../json/page-1.json', 'json')
    .then(data => {
      data.forEach(horned => {
        hornedArray.push(new HornedAnimal(horned));
      });
    })
    .then(
      $.get('../json/page-2.json', 'json')
      .then(data => {
        data.forEach(horned => {
          hornedArray.push(new HornedAnimal(horned));
        });
      })
    )
    .then(() => {
      hornedArray.forEach(element => $('#photo-gallery').append(pageRender(element)));
    })
    .then(() => {
      addSet(hornedArray);
    })
    .then(() => {
      filterSet.forEach(element => dropDownRender(element));
    })
    .then(buttonSwitch)
    .then(filterFunction)
    .then(buttonSwitch);

};

const addSet = obj => {
  obj.forEach(element => filterSet.add(element.keyword));
};

const sortByTitle = (array) => {
  array.sort(function (a, b) {
    var nameA = a.title.toLowerCase();
    var nameB = b.title.toLowerCase();
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    } else {
      return 0
    }
  })
  return array;
}

const sortByNumber = (array) => {
  array.sort((a, b) => {
    return a.horns - b.horns
  })
  return array;
}

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

const filterFunction = () => {

  $('select').on('change', function () {
    tempSortArray = [];
    $('#photo-gallery')
      .children()
      .remove();
    hornedArray.forEach(element => {
      if (($('select').val()) === element.keyword) {
        tempSortArray.push(element);
        $('#photo-gallery').append(pageRender(element))
      }
    })
  });
};

const buttonSwitch = () => {

  $('#nameSort').on('click', function () {
    if (nameSortCheck === false && tempSortArray[0] === undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      hornedArray = sortByTitle(hornedArray);

      hornedArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element)));
      nameSortCheck = true;
      hornSortCheck = false;
    } else if (tempSortArray[0] !== undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      tempSortArray = sortByTitle(tempSortArray);

      tempSortArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element)));
      nameSortCheck = true;
      hornSortCheck = false;
    }
  });

  $('#hornSort').on('click', function () {
    if (hornSortCheck === false) {
      $('#photo-gallery')
        .children()
        .remove();
      hornedArray = sortByNumber(hornedArray);
      hornedArray.forEach(element => $('#photo-gallery').append(pageRender(element)));
      nameSortCheck = false;
      hornSortCheck = true;
    } else if (tempSortArray[0] !== undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      tempSortArray = sortByNumber(tempSortArray);

      tempSortArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element)));
      nameSortCheck = false;
      hornSortCheck = true;
    }
  });
};

$(() => readJson());