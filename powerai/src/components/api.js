export const api=async(query)=>{
    const data = await fetch('https://app-deploy-backend-07jl.onrender.com',{
        method:'POST',
        headers:{
        'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
        prompt: query
        })
    })
    
    return data;
}
