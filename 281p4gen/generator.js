function gen(num_zeros,min,max,amount){
    num_zeros=parseInt(num_zeros);
    min=parseInt(min);
    max=parseInt(max);
    amount=parseInt(amount);
    var res=[];
    var hasBorder=false;
    for(var i=0;i<num_zeros;i++){
        var seed=Math.random();
        var val=Math.floor(seed*(max-min))+min;
        if(!hasBorder && max>0 && val<0){
            hasBorder=true;
            val=0-val;
        }
        if(val>=0)hasBorder=true;
        var el=[];
        if(seed>=.5){
            el=[val,0];
        }else{
            el=[0,val];
        }
        res.push(el);
    }
    for(var i=num_zeros;i<amount;i++){
        var seed=Math.random();
        var val=Math.floor(seed*(max-min))+min;
        var el=[val,0];
        seed=Math.random();
        val=Math.floor(seed*(max-min))+min;
        el[1]=val;
        res.push(el);
    }
    res=shuffle(res);
    return res;
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }