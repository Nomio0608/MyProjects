export default class Item {
  //baiguulagch
  constructor(itemObj) {
    
    this.artist = itemObj.artist;
    this.img = itemObj.img;
    this.type = itemObj.type;
    this.part = itemObj.part;
    this.count = itemObj.count;
  }

  Render() {
    return `<article class="makeupPic item">
       <img src=${this.img} alt="niran" />
       <h3>Артист ${this.artist}</h3>
       <div class="star">
        <my-star count="${this.count}">
       </div>
     </article>
     `;
  }
}
