var Menu = React.createClass({
    getInitialState: function() {
        return {
            selectedItem: null
        };
    },

    render: function() {
        return <div className="btn-group btn-group-lg" role="group" aria-label="...">
            {this.props.items.map(function(item){
                if (this.state.selectedItem == null && item.selected === true) {
                    this.state.selectedItem = item;
                };

                var className = 'btn btn-' + (this.state.selectedItem.id === item.id ? 'primary' : 'default');

                return <span key={item.id}
                             id={'menuitem_' + item.id}
                             className={className}
                             onClick={this.handleSelectItem.bind(this,item)}>{item.title}</span>;
                }, this)
                }
        </div>;
    },

    shouldComponentUpdate(nextProps, nextStates) {
       return true;
    },

    getClassName(item) {
        return 'btn btn-' + (this.state.selectedItem.id === item.id ? 'primary' : 'default');
    },

    handleSelectItem: function(item) {
        this.setState({selectedItem: item});

        if (item.onSelect) {
            item.onSelect();
        }
    },

    componentDidMount: function() {
        if (this.state.selectedItem.onSelect) {
            this.state.selectedItem.onSelect();
        }
    }
});

var Header = React.createClass({
    render: function() {
        return <div className="container well">
            <div className="center-block text-center">
                {this.props.children}
            </div>
        </div>;
    }
});

var Body = React.createClass({
    render: function() {
        return <div>
            {this.props.children}
        </div>;
    }
});

// <Column column={id:string, type:text/number/dropdown} value={object}
//      ddItems={[]} ddKey={string} ddValue={string} editable={true/false} />
var Column = React.createClass({
    render: function() {
        var key = 'col_' + this.props.column.name + '_' + this.props.rowix
        var col;
        if (this.props.editable && this.props.column.editable) {
            if (this.props.column.type == 'dropdown') {
                col = <select type="number" key={key} className="form-control" value={this.props.value} onChange={this.handleOnValueChange}>
                    {this.props.dataRef[this.props.column.ddData].map(function(data){
                        return <option value={data[this.props.column.ddValue]}>
                            {data[this.props.column.ddLabel]}</option>;
                    }, this)};
                </select>;
            } else {
                col = <input key={key} id={key}
                             className="form-control"
                             type={this.props.column.type}
                             value={this.props.value}
                             onChange={this.handleOnValueChange} />
            }
        } else {
            if (this.props.column.type == 'dropdown') {
                var label = "";
                this.props.dataRef[this.props.column.ddData].some(function(data){
                    if (data[this.props.column.ddValue] == this.props.value) {
                        label = data[this.props.column.ddLabel];
                        return true;
                    }
                }, this);
                col = <span key={key}>{label}</span>
            } else {
                col = <span key={key}>{this.props.value}</span>;
            }
        }
        return <span>{col}</span>;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    handleOnValueChange: function(elm) {
        this.props.value = this.props.column.type == "dropdown" ? Number(elm.target.value) : elm.target.value;
        if (this.props.onValueChange) {
            this.props.onValueChange(this.props.row, this.props.column, this.props.value);
        }
        this.forceUpdate();
    }

})

var TableRowAction = React.createClass({
    render: function() {
        var row = this.props.row;
        var editingClass = this.props.editable ? '' : 'hidden';
        var nonEditingClass = this.props.editable ? 'hidden' : '';

        return <span className="btn-group pull-right">
                    <span className={editingClass}>
                        <button type="button" className="btn btn-success glyphicon glyphicon-ok"
                              onClick={this.handleOnClickOk.bind(this,row)} />
                        <button type="button" className="btn btn-default glyphicon glyphicon-remove"
                              onClick={this.handleOnClickCancel.bind(this,row)}/>
                    </span>
                    <span className={nonEditingClass}>
                        <button type="button" className="btn btn-md btn-default glyphicon glyphicon-pencil"
                                onClick={this.handleOnClickEdit.bind(this,row)}/>
                        <button type="button" className="btn btn-md btn-danger glyphicon glyphicon-remove"
                                onClick={this.handleOnClickDelete.bind(this,row)} />
                    </span>
                </span>;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    handleOnClickEdit: function(row) {
        if (this.props.onClickEdit) {
            this.props.onClickEdit(row);
        }
    },

    handleOnClickCancel: function(row) {
        if (this.props.onClickCancel) {
            this.props.onClickCancel(row);
        }
    },

    handleOnClickOk: function(row) {
        if (this.props.onClickOk) {
            this.props.onClickOk(row);
        }
    },

    handleOnClickDelete: function(row) {
        if (this.props.onClickDelete) {
            this.props.onClickDelete(row);
        }
    }

});

var Table = React.createClass({
    render: function() {
        return <table className="table">
                <thead>
                    <tr>
                        {this.props.columns.map(function(col){
                            return <th key={col.name}>{col.title}</th>;
                            })}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map(function(row,rowix){
                        return <tr>
                            {this.props.columns.map(function(col){
                                return <td key={col.name}>
                                    <Column key={'Column'+rowix} rowix={rowix}
                                            row={row} column={col} value={row[col.name]} dataRef={this.props.dataRef}
                                            editable={row.editable}
                                            onValueChange={this.props.onValueChange} />
                                </td>;
                            }, this)}
                            <td>
                                <TableRowAction key={'TableRowAction'+rowix}
                                            row={row} editable={row.editable}
                                            onClickOk={this.props.onClickOk}
                                            onClickCancel={this.props.onClickCancel}
                                            onClickEdit={this.props.onClickEdit}
                                            onClickDelete={this.props.onClickDelete} />
                            </td>
                        </tr>
                    }, this)}
                </tbody>
            </table>;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    }
})

var Page = React.createClass({
    getInitialState: function() {
        return {
            data: this.props.data,
            pageChanged: false
        }
    },

    render: function() {
        return <div id={'page_' + this.props.name} className='hidden'>
            <Table columns={this.props.columns} data={this.state.data.all} dataRef={this.state.data}
                   onClickEdit={this.onClickEdit}
                   onClickCancel={this.onClickCancel}
                   onClickOk={this.onClickOk}
                   onClickDelete={this.onClickDelete}
                   onValueChange={this.onValueChange} />
            <div className="row">
                <div className="center-block text-center">
                    <button type="button" className="btn btn-info box-shadow--4dp" onClick={this.retrieve}>Refresh</button>
                    <button type="button" className="btn btn-success box-shadow--4dp" onClick={this.add}>Add Department</button>
                </div>
            </div>
        </div>;
    },

    componentDidMount: function() {
        this.retrieve();
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    onClickEdit: function(row) {
        row.editable = true;
        this.forceUpdate();
    },

    onClickCancel: function(row) {
        if (row.id > 0) {
            row.editable = false;
        } else {
            this.deleteRowFromData(row);
        }
        this.forceUpdate();
    },

    onClickOk: function(row) {
        if (row.id > 0) {
            this.save(row);
        } else {
            this.create(row);
        }
        this.forceUpdate();
    },

    onClickDelete: function(row) {
        this.delete(row);
        this.forceUpdate();
    },

    onValueChange: function(row, col, val) {
        var ix = this.getRowIndex(row);
        if (ix >= 0) {
            var urow = this.state.data.all[ix];
            urow[col.name] = val;
            this.forceUpdate();
        }
    },

    getRowIndex: function(row) {
       for (var i = 0; i < this.state.data.all.length; i++) {
          if (this.state.data.all[i].id == row.id) {
              return i;
          }
       };
       return -1;
    },

    deleteRowFromData: function(row) {
        var ix = this.getRowIndex(row);
        if (ix >= 0) {
            this.state.data.all.splice(ix, 1);
            return true;
        } else {
            return false;
        }
    },

    updateRowToData: function(row,ix) {
        if (!ix) {
            ix = this.getRowIndex(row);
        }
        if (ix >= 0) {
            this.state.data.all[ix] = row;
            this.setState({data: this.state.data.all});
            return this.state.data.all[ix];
        }
        return row;
    },

    fixDataTypes: function(row) {
        this.props.columns.forEach(function(col) {
            if (col.type == "number" && row[col.name]) {
                row[col.name] = Number(row[col.name])
            }
        });
        return row;
    },

    retrieve: function() {
        $.ajax({
            type: 'GET',
            url: '/' + this.props.name,
            headers: {'Accept': 'application/json'},
            success: function(data) {
                this.setState({data: data})
            }.bind(this)
        });
    },

    reset: function() {
        this.setState({data: []});
    },

    add: function() {
        var newObj = {editable: true};
        this.props.columns.forEach(function(c){
            newObj[c.name] = null
        });
        this.state.data.all.push(newObj);
        this.setState({data: this.state.data});
        var focusId = "#col_name_" + (this.state.data.all.length-1);
        $(focusId).focus();
    },

    create: function(row) {
        row.id = 0; // temp
        $.ajax({
            type: 'POST',
            url: '/' + this.props.name,
            headers: {'Accept': 'application/json'},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(this.fixDataTypes(row)),
            success: function(data) {
                for(var k in data) row[k]=data[k];
                row.editable = false;
                this.forceUpdate();
            }.bind(this)
        });
    },

    save: function(row) {
        row = this.fixDataTypes(row);
        $.ajax({
            type: 'PUT',
            url: '/' + this.props.name + '/' + row.id,
            headers: {'Accept': 'application/json'},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(row),
            success: function(data) {
                for(var k in data) row[k]=data[k];
                row.editable = false;
                this.forceUpdate();
            }.bind(this)
        });
    },

    delete: function(row) {
        $.ajax({
            type: 'DELETE',
            url: '/' + this.props.name + '/' + row.id,
            headers: {'Accept': 'application/json'},
            success: function(data) {
                this.deleteRowFromData(row);
                this.forceUpdate();
            }.bind(this)
        });
    }

});


var Home = React.createClass({
    getInitialState: function() {
        return {
            menuItems: [
                {
                    id: "emp",
                    title: "Employees",
                    onSelect: this.showEmpPage, onUnselect: this.hideEmpPage, selected: true,
                    columns: [
                        {name: "id", title: "ID", type: "number", editable: false},
                        {name: "name", title: "Name", type: "text", editable: true},
                        {name: "deptId", title: "DeptID", type: "dropdown", ddData: "depts", ddValue: "id", ddLabel: "name", editable: true}
                    ],
                    data: {all: [], depts: []}
                },
                {
                    id: "dept",
                    title: "Departments",
                    onSelect: this.showDeptPage, onUnselect: this.hideDeptPage,
                    columns: [
                        {name: "id", title: "ID", editable: false},
                        {name: "name", title: "Name", editable: true}
                    ],
                    data: {all: []}
                }
            ]
        }
    },

    render: function() {
        return <div>
                <Header>
                    <Menu items={this.state.menuItems}/>
                </Header>
                <Body>
                    {this.state.menuItems.map(function(item) {
                        return <Page key={item.id} name={item.id} title={item.title} columns={item.columns} data={item.data} />;
                        }
                    )}
                </Body>
            </div>;
    },

    showEmpPage: function() {
        $('#page_emp').removeClass('hidden');
        $('#page_dept').addClass('hidden');
    },
    hideEmpPage: function() {
        $('#page_emp').addClass('hidden');
    },

    showDeptPage: function() {
        $('#page_dept').removeClass('hidden');
        $('#page_emp').addClass('hidden');
    },
    hideDeptPage: function() {
        $('#page_dept').addClass('hidden');
    }
});

React.render(<Home/>, document.getElementById("contents"));
