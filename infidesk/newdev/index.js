class BaseClass {

}

class SomeClass {
  constructor() {
    this.someproperty = 1
  }
  somefunction() { return this.someproperty }
}
let sc = new SomeClass()

let SomeClassB = () => {
  let someproperty = 1
  let somefunction = () => someproperty
  return { someproperty, somefunction }
}

let SomeClassD = () => {
  const $ = {}
  $.someproperty = 1
  $.somefunction = () => $.someproperty
  return $
}

let SomeClassC = () => {
  const $ = {}; with ($) {
    $.someproperty = 1
    $.somefunction = () => someproperty
  } return $
}