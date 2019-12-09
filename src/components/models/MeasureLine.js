export default class MeasureLine {
  constructor(pt1, pt2, isHover = false, isSelected = false, isHandleHover = 0) {
    this.id = MeasureLine.counter++;
    this.pt1 = pt1;
    this.pt2 = pt2;
    this.isHover = isHover;
    this.isSelected = isSelected;
    this.isHandleHover = isHandleHover;
    this.lengthUnits = this.calculateLength();
    // this.imgSizeUnits set from onClickDoneSetting in Main.js
  }


  calculateLength = () => {
    let leftPoint = this.pt1.x <= this.pt2.x ? this.pt1 : this.pt2;
    let rightPoint = leftPoint === this.pt1 ? this.pt2 : this.pt1;

    let base = (rightPoint.x - leftPoint.x) * this.imgSizeUnits.width;
    let height = (rightPoint.y - leftPoint.y) * this.imgSizeUnits.height;
    let hypotenuse = Math.sqrt((base ** 2) + (height ** 2))
    return Math.round(hypotenuse);
    // one percent is how many image Units
    // how many image units in the x didrection and y direction
  }

}

MeasureLine.counter = 0;
