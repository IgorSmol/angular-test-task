var modul = angular.module('app', ['ngAnimate', 'ng-file-model']);

modul.controller('mainCtl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){

  $scope.lastState = 0;
  $scope.prePage = 16;
  $scope.currPage = 0;
  $scope.paginStep = 3;
  $scope.albumsPre = [];
  
  $scope.modalTitle;
  
  $http.get('/albums/all').then(function(data){
    $scope.albums = data.data;
    
    for(var key in $scope.albums){
      if($scope.lastState >= $scope.prePage){
        break;
      }else{
        $scope.albumsPre.push($scope.albums[key]);
        $scope.lastState += 1;
      } 
    }
    
  },function(data){
    console.log(data);
  });

  $http.get('/albums/count').then(function(data){
    $scope.count = data.data;
    
    $scope.pagination = initPagin($scope.count.value, $scope.prePage);
  },function(data){
    console.log(data);
  });
  
  $scope.deleteAlbum = function(id, event){
    delete $scope.albums[id];
    $scope.albumsPre = [];
    $scope.lastState = 0;
    
    for(var key in $scope.albums){
      if($scope.lastState >= $scope.prePage){
        break;
      }else{
        $scope.albumsPre.push($scope.albums[key]);
        $scope.lastState += 1;
      } 
    }
    
    $scope.count.value -= 1;
    $http.delete('/albums/delete/' + id).then(function(data){
      console.log(data);
    },function(data){
      console.log(data);
    });
  };
  
  $scope.paginReset = function(num){
    //$("html, body").animate({scrollTop: 0}, "slow");
    if($scope.currPage+1 != num){
      $scope.albumsPre = [];
      $scope.currPage = num - 1;
      var paginCount = $scope.prePage * num;
      
      if($scope.currPage > $scope.paginStep){
        if($scope.currPage + 3 <= $scope.pagination.paginMax){
          $scope.pagination.paginList = [];
          for(var i=0;i<5;i++){
            if(!$scope.pagination.paginListFull[$scope.currPage+i]){
              break;
            }
            $scope.pagination.paginList[i] = $scope.pagination.paginListFull[$scope.currPage+i-1];
            $scope.paginStep = $scope.pagination.paginListFull[$scope.currPage+i-1];
          }
          $scope.paginStep -= 2;
          $scope.firstDots = true;
        }
        
        if($scope.currPage + 5 >= $scope.pagination.paginMax){
          $scope.lastDots = true;
        }else{
          $scope.lastDots = false;
        }
      }

      $scope.lastState = paginCount - $scope.prePage;
      console.log("----------------");
      for(var i=$scope.lastState;i<paginCount;i++){
        $scope.albumsPre.push($scope.albums[i]);
        console.log(i + ' ' + $scope.albums[i].title);
      }
      $scope.lastState = paginCount;
    }
  };
  
  $scope.paginFirst = function(){
    //$("html, body").animate({scrollTop: 0}, "slow");
    $scope.albumsPre = [];
    $scope.currPage = 0;
    var paginCount = $scope.prePage;
    $scope.lastDots = false;
    $scope.firstDots = false;
    
    $scope.pagination.paginList = [];
    for(var i=0;i<4;i++){
      $scope.pagination.paginList[i] = i+2;
    }
    
    $scope.paginStep = 3;
    $scope.lastState = 0;
    console.log("----------------");
    for(var i=$scope.lastState;i<paginCount;i++){
      if(!$scope.albums[i]){
        break;
      }
      $scope.albumsPre.push($scope.albums[i]);
      console.log(i + ' ' + $scope.albums[i].title);
    }
  };
  
  $scope.paginLast = function(){
    //$("html, body").animate({scrollTop: 0}, "slow");
    $scope.albumsPre = [];
    $scope.currPage = $scope.pagination.paginMax;
    var paginCount = $scope.prePage * $scope.pagination.paginMax;
    $scope.lastDots = true;
    $scope.firstDots = true;
    
    $scope.pagination.paginList[4] = $scope.pagination.paginMax -1;
    $scope.pagination.paginList[3] = $scope.pagination.paginMax -2;
    $scope.pagination.paginList[2] = $scope.pagination.paginMax -3;
    $scope.pagination.paginList[1] = $scope.pagination.paginMax -4;
    $scope.pagination.paginList[0] = $scope.pagination.paginMax -5;
    $scope.paginStep = $scope.pagination.paginMax - 3;
    
    $scope.lastState = paginCount - $scope.prePage;
    console.log("----------------");
    for(var i=$scope.lastState;i<paginCount;i++){
      if(!$scope.albums[i]){
        break;
      }
      $scope.albumsPre.push($scope.albums[i]);
      console.log(i + ' ' + $scope.albums[i].title);
    }
    $scope.lastState = paginCount;
  };
  
  function initPagin(all, per_page){
    var listFull = [];
    var list = [];
    for(var i=2;i<Math.ceil(all/per_page);i++){
      listFull.push(i);
      if(i <= 5){
        list.push(i);
      }
    }
    return {
      paginMax: Math.ceil(all/per_page),
      paginList: list,
      paginListFull: listFull
    };
  }
  
  $scope.modalOptions = function(state, data){
    if(state == 'Create'){
      $scope.modalTitle = 'Create';
      $scope.modalData = {};
    }else if('Edit'){
      $scope.modalTitle = 'Edit';
      $scope.modalData = data;
    }
  };
  
  $scope.saveAlbum = function(state, data, file){
    if(state == 'Create'){
      $scope.count.value += 1;
      data.logoUrl = file.data;
      $http.post('/albums/add', data).then(function(data){
        console.log(data);
      },function(data){
        console.log(data);
      });
    }else if('Edit'){
      var ID = data.id;
      data.price = '' + data.price;
      data.year = '' + data.year;
      data.logoUrl = file.data;
      $http.post('/albums/update/' + ID, data).then(function(data){
        console.log(data);
      },function(data){
        console.log(data);
      });
    }
  };
  
  
  
}]);

