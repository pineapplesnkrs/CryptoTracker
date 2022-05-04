let mongoose = require('mongoose');
let exSchema = require('./exerciseSchema');

const activitySchema= new mongoose.Schema(
    {
        activity : {
            type: exSchema
        } ,
        weight: Number,
        distance: Number,
        time: {
            type: Number, 
            validate: {
                validator: function(){
                    return (this.time>0)
                }, 
                message: "Time must be greater than 0!"
            },
            required: [true,'You must enter a time for speed']
        },
        user: String
        
    });
    
    activitySchema.loadClass(tracker);
    activitySchema.path('activity').required(true, 'You must enter an activity to track');
    activitySchema.path('weight').required(true, 'You must enter a weight for calculation');
    activitySchema.path('distance').required(true, 'You must enter a distance for everything');
    const actCol=mongoose.model('Activity', activitySchema)

    module.exports = actCol;