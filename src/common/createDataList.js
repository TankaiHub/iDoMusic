export class CreateListData{
    constructor(type, id, album, imgUrl, name, playCount, nickname) {
        this.type = type; 
        this.id = id;
        this.album = album;
        this.picUrl = imgUrl;
        this.name = name;
        this.playCount = playCount;
        this.nickname = nickname;
    }
}

export class CreateGridList{
    constructor(type, id, album, picUrl, name, playCount) {

    }
}