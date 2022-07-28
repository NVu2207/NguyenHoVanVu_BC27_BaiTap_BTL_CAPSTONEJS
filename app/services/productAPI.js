let baseURL = "https://62b1339ae460b79df05382dc.mockapi.io/api/Products";

function apiGetProducts(search) {
  return axios({
    url: baseURL,
    method: "GET",
    param: {
      type: search,
    },
  });
}

function apiAddProduct(product) {
  return axios({
    url: baseURL,
    method: "POST",
    data: product,
  });
}

function apiDeleteProduct(productId) {
  return axios({
    url: `${baseURL}/${productId}`,
    method: "DELETE",
  });
}

function apiGetProductDetail(productId) {
  return axios({
    url: `${baseURL}/${productId}`,
    method: "GET",
  });
}

function apiUpdateProduct(product) {
  return axios({
    url: `${baseURL}/${product.id}`,
    data: product,
    method: "PUT",
  });
}
