var Arr=[];
function censor(){
    return function (x,y){
        if(x!=null&&y!=null){
            Arr.push(new Array(x,y));
        }
        else{
            result=x==null?y:x;
            for(var i=0;i<Arr.length;i+=1){
                reg=RegExp(Arr[i][0],"g");
                result=result.replace(reg,Arr[i][1]);
            }
            return result;
        }

    };

};





const change=censor();

console.log(change('PHP','JS'));
console.log(change('backend', 'frontend'));
console.log(change('PHP is the most popular programming language for backend web-development'))






