import {Pipe, Injectable, PipeTransform} from "@angular/core";
@Pipe({
    name: 'messagesFilter'
})


export class MessagesFilter implements PipeTransform{
    transform(items: any[], args: any[]): any{
        return items.filter(item => item.sender == args[0] || item.receiver == args[0])
    }
}