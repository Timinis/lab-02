'use strict';

function HornedAnimal(hornedObject) {
  this.title = hornedObject.title;
  this.description = hornedObject.description;
  this.keyword = hornedObject.keyword;
  this.horns = hornedObject.horns;
  this.image_url = hornedObject.image_url;
}

let hornedArray = [];
let hornedArray2 = [];
const filterSet = new Set();
let nameSortCheck = false;
let hornSortCheck = false;
let tempSortArray = [];
let pageLimit = 20;

const readJson = () => {
  $.get('../json/page-1.json', 'json')
    .then(data => {
      data.forEach(horned => {
        hornedArray.push(new HornedAnimal(horned));
      });
    })
    .then(
      $.get('../json/page-2.json', 'json').then(data => {
        data.forEach(horned => {
          hornedArray.push(new HornedAnimal(horned));
        });
      })
    )
    .then(() => {
      if (hornedArray.length > pageLimit) {
        hornedArray2 = hornedArray.splice(0, 20);
      }
      hornedArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element))
      );
    })
    .then(() => {
      addSet(hornedArray);
      addSet(hornedArray2);
    })
    .then(() => {
      filterSet.forEach(element => dropDownRender(element));
    })
    .then(pageSwitch)
    .then(buttonSwitch)
    .then(filterFunction)
    .then(buttonSwitch);
};

const addSet = obj => {
  obj.forEach(element => filterSet.add(element.keyword));
};

const sortByTitle = array => {
  array.sort(function(a, b) {
    var nameA = a.title.toLowerCase();
    var nameB = b.title.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });
  return array;
};

const sortByNumber = array => {
  array.sort((a, b) => {
    return a.horns - b.horns;
  });
  return array;
};

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
  $('select').on('change', function() {
    tempSortArray = [];
    $('#photo-gallery')
      .children()
      .remove();
    hornedArray.forEach(element => {
      if ($('select').val() === element.keyword) {
        tempSortArray.push(element);
        $('#photo-gallery').append(pageRender(element));
      }
    });
    hornedArray2.forEach(element => {
      if ($('select').val() === element.keyword) {
        tempSortArray.push(element);
        $('#photo-gallery').append(pageRender(element));
      }
    });
  });
};

const buttonSwitch = () => {
  $('#nameSort').on('click', function() {
    if (nameSortCheck === false && tempSortArray[0] === undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      hornedArray = hornedArray.concat(hornedArray2);
      hornedArray = sortByTitle(hornedArray);
      hornedArray2 = hornedArray.splice(20, 20);
      hornedArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element))
      );
      nameSortCheck = true;
      hornSortCheck = false;
    } else if (tempSortArray[0] !== undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      tempSortArray = sortByTitle(tempSortArray);

      tempSortArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element))
      );
      nameSortCheck = true;
      hornSortCheck = false;
    }
  });

  $('#hornSort').on('click', function() {
    if (hornSortCheck === false) {
      $('#photo-gallery')
        .children()
        .remove();
      hornedArray = hornedArray.concat(hornedArray2);
      hornedArray = sortByNumber(hornedArray);
      hornedArray2 = hornedArray.splice(20, 20);
      hornedArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element))
      );
      nameSortCheck = false;
      hornSortCheck = true;
    } else if (tempSortArray[0] !== undefined) {
      $('#photo-gallery')
        .children()
        .remove();
      tempSortArray = sortByNumber(tempSortArray);

      tempSortArray.forEach(element =>
        $('#photo-gallery').append(pageRender(element))
      );
      nameSortCheck = false;
      hornSortCheck = true;
    }
  });
};

const pageSwitch = () => {
  $('#pages1').on('click', function() {
    $('#photo-gallery')
      .children()
      .remove();
    hornedArray.forEach(element =>
      $('#photo-gallery').append(pageRender(element))
    );
  });
  $('#pages2').on('click', function() {
    $('#photo-gallery')
      .children()
      .remove();
    hornedArray2.forEach(element =>
      $('#photo-gallery').append(pageRender(element))
    );
  });
};
$(() => readJson());
