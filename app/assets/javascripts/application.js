// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require svg
//= require svg.draggable
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require ./customer/customer
//= require ./restaurant/restaurant

function UserException(message){
  this.message = message
  this.name = "UserException"
}

var FloorPlan = {
  init: function(){
    this.drawing = SVG('floorplan').size('100%','100%')
    this.drawing.attr({id: 'floor'})
    this.drawing.stroke({color: 'black', width: 2})
    this.tables = new Array()
    this.tableGroups = new Array()
  },

  getTableById: function(id){
    var table = FloorPlan.tables.filter(function(element) {
      return element.drawing.attr('id') === id
    })
    return table[0]
  },

  getChairById: function(id){
    var chairs = new Array()
    $.each(this.tables, function(index, value) {
      $.each(value.chairs, function(index, value) {
        chairs.push(value)
      })
    })
    var chair = chairs.filter(function(element) {return element.drawing.attr('id') === id})
    if (chair.length > 0) {
    return chair[0]
    } else {
      throw new UserException("ChairNotFound");
    }
  }
}

function Chair(id, tableId) {
  this.id = id
  this.tableId = tableId
  // var nested = FloorPlan.drawing.nested()
  // nested.attr({id: 'svg_' + tableId + 'chair' + id})
  this.width = 35
  this.height = 35

  var table = FloorPlan.getTableById(this.tableId)
  this.drawing = nested.rect(50,50).attr({class: 'chair', id: tableId + 'chair' + id})
  this.drawing.draggable()
  this.drawing = FloorPlan.drawing.rect(this.width,this.height).attr({class: 'chair', id: tableId + 'chair' + id})

  table.group.add(this.drawing)


  // this.drawing.draggable()
  // table.group.add(this.drawing)
    // this.group.add(this.drawing)
  // table.group.add(this.drawing)
}

Chair.prototype = {
  clickEvent: function(){

  }
}

var AddTableButton = {
  init: function(){
    $('#create_table').click(function(event){
      AddTableButton.addClickEvent()
    })
    this.tableCounter = 1
  },

  addClickEvent: function(){
    var table = new Table(AddTableButton.tableCounter)
    AddTableButton.tableCounter += 1
    FloorPlan.tables.push(table)
  },

  getTableById: function(id){
    var table = FloorPlan.tables.filter(function(element) {
      return element.drawing.attr('id') === id
    })
    return table[0]
  }
}

function Form(tableId) {
  this.tableId = tableId
  this.addForeignObject()
}

Form.prototype = {
  addForeignObject: function(){
    var table = FloorPlan.getTableById(this.tableId)
    $('#input_forms').append(this.form())
    $('#form' + this.tableId).append(this.changeSizeButtons(table))
    this.increaseTableSizeEvent(table)
    this.decreaseTableSizeEvent(table)
    // console.log(this)
    this.submitEvent(this.tableId)
  },

  form: function(tableId){
    var chairForm = '<div id="form'+ this.tableId + '">' + this.tableId + '<form> Number of Chairs <input id="numChairs" type="text"><input type="submit"></form></div>'
    return chairForm
  },

  changeSizeButtons: function(table){
    var buttons = 'Size of Table <button id="increase"> Increase </button> <button id="decrease"> Decrease </button>'
    return buttons
  },

  increaseTableSizeEvent: function(table){
    $('#increase').on('click', function(event) {
      var width = table.width
      var height = table.height
      table.drawing.size(width + 10, height + 10)
      table.width += 10
      table.height += 10
      table.placeChairs(table)
    })
  },

  decreaseTableSizeEvent: function(table){
    $('#decrease').click(function(event) {
      var width = table.width
      var height = table.height
      table.drawing.size(width - 10, height - 10)
      table.width -= 10
      table.height -= 10
      table.placeChairs(table)
    })
  },

  submitEvent: function(tableId){
    $('#form' + this.tableId).submit(function(event){
      event.preventDefault()
      numChairs = $('#numChairs').val()
      var table = FloorPlan.getTableById(tableId)
      table.createChairs(numChairs)
    })
  }
}

function Table(id) {
  var nested = FloorPlan.drawing.nested()
  nested.attr({id: 'svg_table' + id})
  // var nested = FloorPlan.drawing.nested()
  // nested.attr({id: 'svg_table' + id})
  this.width = 100
  this.height = 100
  // this.drawing = nested.circle(this.width,this.height).attr({fill: 'white', class: 'table', id: 'table' + id})
  this.drawing = FloorPlan.drawing.circle(this.width,this.height).attr({fill: 'white', class: 'table', id: 'table' + id})
  this.drawing.stroke({color: 'black', width: 2})
  // this.drawing.draggable()
  this.drawing.center(100, 150)

  this.group = FloorPlan.drawing.group()
  this.group.attr({id: 'groupTable' + id})
  this.group.add(this.drawing)
  this.group.draggable()
  FloorPlan.tableGroups.push(this.group)
  this.drawing.click(this.ClickEvent)
}

Table.prototype = {

  clickEvent: function(){
    var tableId = this.drawing.attr('id')
    var tableMenu = new Form(tableId)
  },

  returnChairs: function(){
    return this.chairs
  },

  //you have to make sure you remove the old chair svg squares, fool
  createChairs: function(numChairs){
    var tableId = this.drawing.attr('id')

    console.log(this)
    // console.log(table.chairs)
    // $.each(table.chairs, function(index, chair) {
    //   console.log(index)
    //   console.log(chairs)
    // })

    if (this.chairs != null) {
      $.each(this.chairs, function(key, chair) {
        console.log(chair.drawing.attr('id'))
        $('#' + chair.drawing.attr('id')).remove()
      })
    }

    this.chairs = null
    this.chairs = new Array()
    for (var i = 0; i < numChairs; i++){
      chair = new Chair(i,tableId)
      this.chairs.push(chair)
    }
    this.placeChairs(this)
  },

  placeChairs: function(table){
    var tableX = table.drawing.attr('cx')
    var tableY = table.drawing.attr('cy')
    var counter = 1
    $.each(this.chairs, function(index, value) {
      value.drawing.move(tableX, tableY + (75 * counter))
    var scalar = table.chairs.length
    var tableX= table.drawing.attr('cx')
    var tableY= table.drawing.attr('cy')
    var counter = 0
    var hypotSide = (table.width / 2.0) * 1.75
    var degreeSpacing = 360.0 / this.chairs.length
    $.each(this.chairs, function(index, value) {
      var circleDegree = degreeSpacing * counter
      var insideAngle = circleDegree % 90.0
      var oppositeSide = (hypotSide * table.getSin(insideAngle) ) / table.getSin(90)
      var otherAngle = 90 - insideAngle
      var otherSide = (hypotSide * table.getSin(otherAngle) ) / table.getSin(90)
      if (circleDegree >= 270){
        value.drawing.center(tableX - otherSide, tableY - oppositeSide)
      } else if (circleDegree >= 180) {
        value.drawing.center(tableX - oppositeSide, tableY + otherSide)
      } else if (circleDegree >= 90) {
        value.drawing.center(tableX + otherSide, tableY + oppositeSide)
      } else if (circleDegree > 0) {
        value.drawing.center(tableX + oppositeSide, tableY - otherSide)
      } else if (circleDegree === 0) {
        value.drawing.center(tableX + oppositeSide, tableY - otherSide)
      } else {
        value.drawing.center(tableX + oppositeSide, tableY + otherSide)
      }
      counter += 1
    })
  },

  getSin: function(degrees){
    return Math.sin(degrees * (Math.PI / 180))
  }
}

var SaveButton = {
  init: function(){
    $('body').on('click', '#save', function(e){
      SaveButton.tablesHash = {}
      $.each(FloorPlan.tables, function(Tableindex, table){
        SaveButton.tablesHash[table.drawing.attr('id')] = {positionX: table.drawing.attr('cx'), positionY: table.drawing.attr('cy'), width: table.width, height: table.height, chairs: {}}
          $.each(table.chairs, function(index, chair) {
            SaveButton.tablesHash[table.drawing.attr('id')].chairs[chair.drawing.attr('id')] = {positionX: chair.drawing.attr('x'), positionY: chair.drawing.attr('y'), width: chair.drawing.attr('width'), height: chair.drawing.attr('height')}
          })
      })
      console.log(SaveButton.tablesHash)
      var token = $('meta[name="csrf-token"]').attr('content')
      $.post('/test', {authenticity_token: token, floorplan: SaveButton.tablesHash}
      )
    })
  }
}


$('document').ready(function() {
  if($('#floorplan').length){
    FloorPlan.init()
    AddTableButton.init()
    SaveButton.init()
    var selectedItem = null
    var nested = FloorPlan.drawing.nested()
    $('body').on('click', 'ellipse', function(e){
      if(this.id != selectedItem){
        var table = FloorPlan.getTableById(this.id)
        table.clickEvent()
        $('#form' + selectedItem).remove()
        selectedItem = this.id
      }
    })
    // alert('body')
    $('body').on("click", ".chair", function(e){
      alert('wtf')
    $('body').on("click", "rect", function(e){
      if(this.id != selectedItem){
        var chair = FloorPlan.getChairById(this.id)
        chair.clickEvent()
      }
    })
  }
});
