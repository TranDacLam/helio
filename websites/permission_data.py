from core.models import Model_Name, Roles, Roles_Permission

MODEL_NAME_CONST = [
{"key":"Advertisement", "name": "Quảng Cáo"},
{"key":"Banner", "name": "Banner"},
{"key":"Event", "name": "Event"},
{"key":"FAQ", "name": "FAQ"},
{"key":"FeedBack", "name": "FeedBack"},
{"key":"Game", "name": "Trò Chơi"},
{"key":"Hot", "name": "Hot"},
{"key":"Post", "name": "Bài Viết"},
{"key":"Promotion_Label", "name": "Nhãn Khuyến Mãi"},
{"key":"Link_Card", "name": "Thẻ Liên Kết"},
{"key":"Notification", "name": "Thông Báo"},
{"key":"Promotion", "name": "Khuyến Mãi"},
{"key":"Fee", "name": "Phí Giao Dịch"},
{"key":"Denomination", "name": "Mệnh Giá Nạp Tiền"},
{"key":"Hot_Advs", "name": "Hot Ads"},
{"key":"Promotion_Type", "name": "Loại Khuyến Mãi"},
{"key":"Open_Time", "name": "Giờ Mở Cửa"}
]
# Init data for model table
for item in MODEL_NAME_CONST:
    obj = Model_Name()
    obj.key = item['key']
    obj.name = item['name']
    obj.save()

# Default permission of role is read
roles_list = Roles.objects.all()
model_list = Model_Name.objects.all()
if roles_list and model_list:
    for model in model_list:
        for role in roles_list:
            per_obj = Roles_Permission()
            per_obj.model_name = model
            per_obj.role = role
            per_obj.permission = 'read'
            per_obj.save()