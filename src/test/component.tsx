import React from "react";

import { Select } from "rich/component/view/select";
import { Input } from "rich/component/view/input";
import { Switch } from "rich/component/view/switch";
import { Button } from "rich/component/view/button";
import { Tab } from 'rich/component/view/tab';
export function Component() {
    var [checked, setChecked] = React.useState(false);
    var [name, setName] = React.useState('kanhai');
    var [sex, setSex] = React.useState('none');
    return <div>
        <Select value={sex} onChange={e => setSex(e)} options={[
            { text: '男', value: 'boy' },
            { text: '女', value: 'girl' },
            { text: '无', value: 'none' }
        ]}></Select>
        <Input value={name} onChange={e => setName(e)} onEnter={e => setName(e)}></Input>
        <Switch checked={checked} onChange={e => { setChecked(e) }}></Switch>
        <Button block>你好</Button>
        <Button ghost>你好</Button>
        <Button>你好</Button>
        <Tab>
            <Tab.Page item={'你好'}>1</Tab.Page>
            <Tab.Page item={'我好'}>2</Tab.Page>
            <Tab.Page item={'它好'}>3</Tab.Page>
        </Tab>
    </div>
}