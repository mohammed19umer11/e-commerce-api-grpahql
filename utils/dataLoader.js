import DataLoader from "dataloader";

class Single {
    loaders = {};
    async load (model, id) {
        const loader = await this.findLoader(model);
        return loader.load(id);
    }
    
    async findLoader (model) {
        if(!this.loaders[model.modelName]) {
            this.loaders[model.modelName] = new DataLoader(async ids => {
                const docs = await model.find({ _id: { $in: ids } });
                const lookUp = await docs.reduce((acc, doc) => {
                    acc[doc._id] = doc;
                    return acc;
                },{});
                return ids.map(id => lookUp[id] || null);
            })
        }
        return await this.loaders[model.modelName];
    }
}

export default Single;