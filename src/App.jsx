import { useState } from 'react';
import axios from 'axios';
import "./assets/style.css";

//API設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
   // 表單資料狀態(儲存登入表單輸入)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
// 登入狀態管理(控制顯示登入或產品頁）
const [isAuth,setIsAuth] = useState(false);
  
// 產品列表狀態
const [products ,setProducts] = useState([]);
const [tempProduct , setTempProduct] = useState(null);


// 表單輸入處理
const handleInputChange = (e) =>{
const { name ,value} = e.target;
  //console.log(name,value);
  setFormData((preData) => ({
    ...preData,// 保留原有屬性
    [name]: value,// 更新特定屬性
  }))
};

const getProducts = async () => {
  try{
    const response = await axios.get(
      `${API_BASE}/api/${API_PATH}/admin/products`
    );
    setProducts(response.data.products);
  }catch(error){
  console(error.response);
 }
};

const onSubmit = async (e) => {
  try{
    e.preventDefault();
    const response = await axios.post(`${API_BASE}/admin/signin`, formData);
    console.log(response.data);
    const{ token , expired} = response.data;
    // 設定 Cookie
    document.cookie = `hexToken=${token}; expires = ${new Date(expired)};`;
    // 讀取 Cookie
    axios.defaults.headers.common['Authorization'] = token;
    getProducts();
    setIsAuth(true);
  }
  catch(error){
    setIsAuth(false);
    console.error(error.response);
  }
};

const checkLogin = async () => {
  try{
    // 讀取 Cookie
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(`${API_BASE}/api/user/check`);
    console.log(response.data);
  }catch (error){
    console.log(error.response?.data.message)
  }
}

  return (
    <>{
      !isAuth ? ( <div className='container text-center'>
      <div className=" row d-flex justify-content-center align-items-center " style={{height: "100vh"}}>
        <div className=" col-5 rounded-5 px-5 py-4  shadow">
          <h3 className="card-title mb-4 fw-bold text-primary">LOGIN</h3>
          <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
           <div className="form-floating mb-3">
              <input type="email" 
                className="form-control" 
                name="username" 
                id="username"
                placeholder="name@example.com"
                value={formData.username} 
                onChange={(e) => handleInputChange(e) }
                autoComplete="username"
              />
              <label htmlFor="username">Email address</label>
              
            </div>
            <div className="form-floating mb-3">
              <input type="password" 
                className="form-control" 
                name="password" 
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange(e) }
                autoComplete="current-password" 
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-4">登入</button>
          </form>   
           <p className='text-center text-secondary'>©2025-KateChou</p>
        </div>
    </div>
     
    </div>):(
      <div className='container'>
         
      
      <div className="row">
        <div className=" col-md-8 p-4 ">
          <button className="btn btn-danger mb-5" type="button" onClick={() => checkLogin()}> 確認是否登入</button>
          <h3 className="fw-bold ">產品列表</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">產品名稱</th>
              <th scope="col">原價</th>
              <th scope="col">售價</th>
              <th scope="col">是否啟用</th>
              <th scope="col">查看細節</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map((product) => (
              <tr key={product.id} >
                <th scope="row" >{product.title}</th>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                <td><button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={() => setTempProduct(product)}>
                    查看
                    </button>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="col-md-4 p-4">
          <h3 className="fw-bold ">產品明細</h3>
          {tempProduct ? (
            <div className="card p-0">
              <img 
              src={tempProduct.imageUrl} 
              className="card-img-top" 
              alt="主圖"/>
              <div className="card-body">
                <h4 className="card-title fw-bold">{tempProduct.title}</h4>
                <p className="card-text mb-4">
                  {tempProduct.description}
                </p>
                <hr></hr>
                <h5 className="card-text">
                  商品{tempProduct.content}
                </h5>
                <h5 className="mb-4">商品價格 : 優惠價 {tempProduct.price} 元 / 
                  <del className="text-secondary"> 原價 {tempProduct.origin_price} 元 </del>
                </h5>
                <hr></hr>
                <h4 className="mb-3 fw-bold"> 
                  更多圖片
                </h4>
                <div>
                  {
                     tempProduct.imagesUrl.map((url,index) => (
                      <img key = {index}
                      src={url}
                      />            
                    ))
                  }
                </div>
              </div>
            </div>
            ) : (
            <p>請選擇產品</p>
          )}
        </div>
        
      </div>
      </div>
    )}
    </>
  );
}

export default App 
