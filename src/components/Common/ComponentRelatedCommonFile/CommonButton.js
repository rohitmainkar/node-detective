import { Button } from "reactstrap"
import { createdBy } from "./listPageCommonButtons";

export function SaveButton(props) {

  const { pageMode, userAcc, module, onClick, editCreatedBy = {}, id=''} = props
  
  const isCreated = (createdBy() === editCreatedBy)

  return (
    <div>
      {
        pageMode === "edit" ?
          (userAcc.RoleAccess_IsEdit) || ((userAcc.RoleAccess_IsEditSelf) && (isCreated)) ?
            <button
              type="submit"
              id={id}
              data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Update ${module}`}
              className="btn btn-success w-md"
              onClick={onClick}
            >
              <i class="fas fa-edit me-2"></i>Update
            </button>
            :
            <></>
          : (
            userAcc.RoleAccess_IsSave ?
              <button
                type="submit"
                id={id}
                data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Save ${module}`}
                className="btn btn-primary w-md"
                onClick={onClick}
              > <i className="fas fa-save me-2"></i> Save
              </button>
              :
              <></>
          )
      }
    </div>
  )
}


export function Go_Button(props) {
  const { onClick } = props
  return (
    <Button
      id="gobtn_submmit" type="button"
      color="btn btn-outline-success border-2 font-size-12 mb-2 "
      onClick={onClick}
    >Go</Button>
  )
}