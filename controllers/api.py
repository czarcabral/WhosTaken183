from gluon.utils import web2py_uuid

def add_class():
    class_id = request.vars.class_id
    db.classes.update_or_insert(
        db.classes.class_id == class_id,
        class_id=class_id,
        class_name=request.vars.class_name,
    )
    rows = db(db.classes.class_id == class_id).select()
    my_class = rows[0]
    return response.json(dict(my_class=my_class))
    # return response.json(dict())
