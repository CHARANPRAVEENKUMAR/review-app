export const isValidEmail=(email)=>{
    const isValid=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return isValid.test(email);
}

export const getToken=()=> localStorage.getItem("auth-token");
// export const getToken=()=> {
//     return   localStorage.getItem("auth-token");
//   }

export const catchError = (error) => {
    const { response } = error;
    if (response?.data) return response.data;
  
    return { error: error.message || error };
  };

export const renderItem = (result) => {
    return (
      <div className="flex rounded overflow-hidden" key={result.id}>
        <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
  };
export const getPoster=(posters=[])=>{
  const {length}=posters;
  if(!length)return null; //default poster

  if(length>2)  return posters[1];
  return posters[0];
}
export const convertReviewCount=(count=0)=>{
    
  if(count<1000) return count;
  return parseFloat(count/1000).toFixed(2)+"k";

}