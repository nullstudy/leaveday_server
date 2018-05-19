exports.currentClassEdit =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {

        let roomId = req.params.roomId;
        let roomDetailId = req.body.roomDetailId;
        if(!((roomId.length && roomDetailId.length) == 24) || ( roomId && roomDetailId ) == undefined){
            console.log('roomId length incorrect');
            output.msg = 'not exist class';
            return res.status(404).send(output);
        }
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo

        if(userInfo[0].type == true ){
            
            let findData = { 
                "_id" : ObjectId(roomId),"room_ClassInfo._id": ObjectId(roomDetailId) 
            };
            let room_ClassInfo = {
                "_id":ObjectId(roomDetailId),
                "classCount": req.body.classCount,
                "classDay": req.body.classDay,
                "classDate": new Date(req.body.classDate),
                "classStartTime":req.body.classStartTime,
                "classEndTime": req.body.classEndTime
            }
            let updateData = { "$set": { "room_ClassInfo.$" : room_ClassInfo }};
            await mongoQuery.updateDate(findData,updateData);
            output.msg = 'success';
            res.setHeader('Authorization',tokenCheck.token);
            res.send(output);
        } else {
            output.msg = 'success';
            output.data = 'not auth';
            res.setHeader('Authorization',tokenCheck.token);
            res.send(output);
        }
    }catch (e) {
        console.log(e)
        output.msg = 'try fail';
        res.send(output);
    }
}