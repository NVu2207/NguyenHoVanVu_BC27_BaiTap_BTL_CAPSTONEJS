main();

function main() {
  apiGetProducts().then(function (result) {
    var products = result.data;

    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.frontCamera,
        product.backCamera,
        product.type,
        product.image,
        product.description
      );
    }

    display(products);
    console.log(products);
  });
}

function display(products) {
  var html = "";
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    html += `
    <tr>
        <td>${i + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
            <img src="${product.image}" width = "70px" height = "70px" />
            
        </td>
        <td>${product.description}</td>

        <td>
            <button class = "btn btn-primary" 
            data-bs-toggle = "modal" 
            data-bs-target = "#modalProduct"
            data-type = "update"
            data-id="${product.id}"
            >Update</button>
            <button 
            class = "btn btn-danger"
            data-type="delete"
            data-id="${product.id}">Delete</button>

        </td>
    </tr>
    `;
  }

  document.getElementById("tbodyProduct").innerHTML = html;
}
function resetForm() {
  document.getElementById("IdProduct").value = "";
  document.getElementById("SP").value = "";
  document.getElementById("giaSP").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("frontCam").value = "";
  document.getElementById("backCam").value = "";
  document.getElementById("loaiDt").value = "";
  document.getElementById("hinhSP").value = "";
  document.getElementById("Mota").value = "";
}
document.getElementById("btnModal").addEventListener("click", showModal);
function showModal() {
  document.querySelector(".modal-title").innerHTML = "Th??m S???n Ph???m";
  document.getElementById("btnUpdate").disabled = true;
  document.getElementById("btnAdd").disabled = false;
}
document.querySelector(".modal-footer").addEventListener("click", handleSubmit);
function handleSubmit(event) {
  var type = event.target.getAttribute("data-type");
  switch (type) {
    case "add":
      addProduct();
      break;
    case "update":
      updateProduct();
      break;
    default:
      break;
  }
}

function updateProduct() {
  var id = document.getElementById("IdProduct").value;

  var name = document.getElementById("SP").value;
  var price = document.getElementById("giaSP").value;
  var screen = document.getElementById("screen").value;
  var frontCamera = document.getElementById("frontCam").value;
  var backCamera = document.getElementById("backCam").value;
  var type = document.getElementById("loaiDt").value;
  var image = document.getElementById("hinhSP").value;
  var description = document.getElementById("Mota").value;

  var product = new Product(
    id,
    name,
    price,
    screen,
    frontCamera,
    backCamera,
    type,
    image,
    description
  );

  var isValid = validation();
  if (!isValid){
    return
  }
  apiUpdateProduct(product)
    .then(function (result) {
      main();
      resetForm();
      $("#modalProduct").modal("hide");
    })
    .catch(function (error) {
      console.log(error);
    });
}
function addProduct() {
  var name = document.getElementById("SP").value;
  var price = document.getElementById("giaSP").value;
  var screen = document.getElementById("screen").value;
  var frontCamera = document.getElementById("frontCam").value;
  var backCamera = document.getElementById("backCam").value;
  var type = document.getElementById("loaiDt").value;
  var image = document.getElementById("hinhSP").value;
  var description = document.getElementById("Mota").value;

  var product = new Product(
    null,
    name,
    price,
    screen,
    frontCamera,
    backCamera,
    type,
    image,
    description
  );

  var isValid = validation();
  if (!isValid){
    return
  }
  apiAddProduct(product)
    .then(function (result) {
      main();
      resetForm();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(function () {
      main();
    })
    .catch(function (error) {
      console.log(error);
    });
}

document
  .getElementById("tbodyProduct")
  .addEventListener("click", handleProductAction);

function handleProductAction(event) {
  var type = event.target.getAttribute("data-type");
  var id = event.target.getAttribute("data-id");

  switch (type) {
    case "delete":
      deleteProduct(id);
      break;
    case "update":
      showUpdateModal(id);
      break;
    default:
      break;
  }
}

function showUpdateModal(productId) {
  document.querySelector(".modal-title").innerHTML = "C???p nh???t s???n ph???m";
  document.getElementById("btnAdd").disabled = true;
  document.getElementById("btnUpdate").disabled = false;
  apiGetProductDetail(productId).then(function (result) {
    var sanPham = result.data;
    document.getElementById("IdProduct").value = sanPham.id;
    document.getElementById("SP").value = sanPham.name;
    document.getElementById("giaSP").value = sanPham.price;
    document.getElementById("screen").value = sanPham.screen;
    document.getElementById("frontCam").value = sanPham.frontCamera;
    document.getElementById("backCam").value = sanPham.backCamera;
    document.getElementById("loaiDt").value = sanPham.type;
    document.getElementById("hinhSP").value = sanPham.image;
    document.getElementById("Mota").value = sanPham.description;
  });
}


function validation() {
  var name = document.getElementById("SP").value;
  var price = document.getElementById("giaSP").value;
  var screen = document.getElementById("screen").value;
  var frontCamera = document.getElementById("frontCam").value;
  var backCamera = document.getElementById("backCam").value;
  var type = document.getElementById("loaiDt").value;
  var image = document.getElementById("hinhSP").value;
  var description = document.getElementById("Mota").value;

  var product = new Product(
    null,
    name,
    price,
    screen,
    frontCamera,
    backCamera,
    type,
    image,
    description
  );
  var isValid = true;

  if (!isRequired(product.name)) {
    isValid = false;
    document.getElementById("tbSP").innerHTML =
      "*T??n s???n ph???m kh??ng ???????c ????? tr???ng";
  } else {
    document.getElementById("tbSP").innerHTML = "";
  }

  if (!isRequired(product.price)) {
    isValid = false;
    document.getElementById("tbGiaSP").innerHTML = "*Ch??a nh???p gi?? s???n ph???m";
  } else if (isNaN(product.price)) {
    isValid = false;
    document.getElementById("tbGiaSP").innerHTML = "*Gi?? s???n ph???m ph???i l?? s???";
  } else {
    document.getElementById("tbGiaSP").innerHTML = "";
  }

  if (!isRequired(product.screen)) {
    isValid = false;
    document.getElementById("tbScreen").innerHTML =
      "*Ch??a nh???p k??ch c??? m??n h??nh";
  } else {
    document.getElementById("tbScreen").innerHTML = "";
  }

  if (!isRequired(product.frontCamera)) {
    isValid = false;
    document.getElementById("tbFrontCam").innerHTML =
      "*Ch??a nh???p gi?? tr??? cam tr?????c";
  } else {
    document.getElementById("tbFrontCam").innerHTML = "";
  }

  if (!isRequired(product.backCamera)) {
    isValid = false;
    document.getElementById("tbBackCam").innerHTML =
      "*Ch??a nh???p gi?? tr??? cam sau";
  } else {
    document.getElementById("tbBackCam").innerHTML = "";
  }

  if (product.type === "") {
    isValid = false;
    document.getElementById("tbLoaiDt").innerHTML =
      "*Ch??a ch???n lo???i ??i???n tho???i";
  } else {
    document.getElementById("tbLoaiDt").innerHTML = "";
  }

  if (!isRequired(product.image)) {
    isValid = false;
    document.getElementById("tbHinhSP").innerHTML =
      "*H??nh s???n ph???m kh??ng ???????c ????? tr???ng";
  } else {
    document.getElementById("tbHinhSP").innerHTML = "";
  }

  if (!isRequired(product.description)) {
    isValid = false;
    document.getElementById("tbMota").innerHTML = "*M?? t??? kh??ng ???????c b??? tr???ng";
  } else {
    document.getElementById("tbMota").innerHTML = "";
  }

  return isValid;
}

function isRequired(value) {
  if (!value) {
    return false;
  }
  return true;
}