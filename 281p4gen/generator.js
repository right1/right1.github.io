function gen(num_zeros,max){
    var res=[];
    for(var i=0;i<num_zeros;i++){
        var seed=Math.random();
        var val=Math.floor(seed*max*2)-max;
        var el=[];
        if(seed>=.5){
            el=[val,0];
        }else{
            el=[0,val];
        }
        res.push(el);
    }
    for(var i=num_zeros;i<10;i++){
        var seed=Math.random();
        var val=Math.floor(seed*max*2)-max;
        var el=[val,0];
        seed=Math.random();
        val=Math.floor(seed*max*2)-max;
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