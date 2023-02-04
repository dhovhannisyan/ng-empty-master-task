
angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
    };
  })
  .directive("contentView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view/content-view.tpl.html",
    };
  })
  .directive("sidebarView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/sidebar-view/sidebar-view.tpl.html",
    };
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })
  .directive("summaryView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view/summary-view.tpl.html",
      controller: ["$scope", "dataService", summaryViewCtrl],
    };
    function summaryViewCtrl($scope, dataService) {  
      $scope.dataService = dataService;
    }
  })
  .directive("elementListView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/element-list-view/element-list-view.tpl.html",
      controller: ["$scope", "dataService", elementListViewCtrl],
    };
    function elementListViewCtrl($scope, dataService) {
      $scope.filter = '';
      $scope.sort = 'title';
      $scope.showOnlyDate = false;
      $scope.dataService = dataService;

      $scope.newTitle = '';

      $scope.addElement = () => {
        if ($scope.newTitle) {
          const el = { 
            id: makeDataId(), 
            title: $scope.newTitle, 
            date: new Date(), tags: [] 
          };
          $scope.dataService.addElement(el);
          $scope.newTitle = '';
        }
      }

      $scope.selectElement = (el) => {
        $scope.dataService.selectElement(el);
      }

      $scope.isSelected = (el) => {
        return el === dataService.selectedElement
      }
    }
  })
  .directive("elementDetailsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/element-details-view/element-details-view.tpl.html",
      controller: ["$scope", 'dataService', elementDetailsViewCtrl],
    };
    function elementDetailsViewCtrl($scope, dataService) {
      $scope.dataService = dataService;
      
      $scope.newTag = '';

      $scope.addTag = () => {
        if ($scope.newTag) {
          $scope.dataService.addTag($scope.newTag);
          $scope.newTag = '';
        }
      }

      $scope.removeTag = (tagIndex) => {
        $scope.dataService.removeTag(tagIndex);
      }
    }
  })
  .factory('dataService', [function(){
    return { 
      elements: dataList,
      selectedElement: null,

      get lastElementTitle() {
        return this.elements[this.elements.length - 1].title;
      },
      
      get unicTags() {
        const allTags = this.elements.reduce((acc, el) => {
          acc = [...acc, ...el.tags];
          return acc;
        }, []);
        return Array.from(new Set(allTags)).join(', ');
      },
      
      addElement(element) {
        this.elements.push(element);
      },

      selectElement(element) {
        this.selectedElement = element;
      },

      addTag(tag) {
        if(this.selectedElement) {
          this.selectedElement.tags.push(tag);
        }
      },

      removeTag(tagIndex) {
        if(this.selectedElement) {
          this.selectedElement.tags.splice(tagIndex, 1);
        }
      }
    };

  }]);
  

