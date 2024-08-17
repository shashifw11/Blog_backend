const getAll = (model,populateParams) => async (req,res) => {
    try{
      const item = await model.find(req.body).lean().exec();
      return res.status(201).send(item);
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const post = (model,populateParams) => async (req, res) => {
    try {
      const item = await model.create(req.body); 
      return res.status(201).send(item);
    } catch (err) { 
      return res.status(500).send(err.message);
    }
  };

const getOne = (model,populateParams)=> async(req,res)=>{
    try {
        const item = await model.findById(req.params.id).lean().exec();
        return res.status(201).send(item);
      } catch (err) {
        return res.status(500).send(err.message);
      }
}

const updateOne = (model,populateParams)=> async(req,res)=>{
    try {
        const item = await model.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          { new: true }
        ) 
          .lean()
          .exec();
        return res.status(201).send(item);
      } catch (err) {
        return res.status(500).send(err.message);
      }
}


const deleteOne = (model,populateParams) => async (req,res)=>{
    try{
       const item = await model.findByIdAndDelete(req.params.id).lean().exec();
       return res.status(201).send(item);
    }catch(err){
        return res.status(500).send(err.message);
    }
}

const getOneWithOnePopulate = (model,populateParams) => async(res,req)=>{
    try{
     const item = await model.findbyId(req.params.id)
     .populate(populateParams)
     .lean()
     .exec()
       return res.status(200).send(item);
    }catch(err){
       return res.status(500).send(err.message);
    }
}

module.exports = (model,populateParams=null)=>({
    get:getAll(model,populateParams),
    post : post(model,populateParams),
    getOne : getOne(model,populateParams),
    updateOne : updateOne(model,populateParams),
    deleteOne : deleteOne(model,populateParams),
    getOneWithOnePopulate : getOneWithOnePopulate(model,populateParams)
})