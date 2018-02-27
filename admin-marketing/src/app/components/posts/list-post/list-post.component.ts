import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-list-post',
    templateUrl: './list-post.component.html',
    styleUrls: ['./list-post.component.css'],
    providers: [PostService]
})
export class ListPostComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    posts: Post[];
    posts_del = []; // Get array id to delete all id post
    select_checked = false; // Check/uncheck all post
    message_result = ''; // Message error

    constructor(private postService: PostService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getPosts();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = `${message.edit} ${params.message_put} ${message.success}`;
            }else if(params.message_post){
                this.message_result = `${message.create_new} ${params.message_post} ${message.success}`;
            }else if(params.message_del){
                this.message_result = 'Xóa thành công.';
            }
        });
    }

    /*
        Function getPosts(): Callback service function getPosts() get all Post
        Author: Lam
    */
    getPosts(){
        this.postService.getPosts().subscribe(
            (data) => {
                this.posts = data;
            } 
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array posts_del
        Author: Lam
    */
    onSelectCKB(event, value){
        if(event.target.checked){
            this.posts_del.push(value.id);
        }else{
            this.posts_del = this.posts_del.filter(k => k !== value.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id post to array posts_del
        Author: Lam
    */
    onSelectAll(event){
        this.posts_del = [];
        let array_del = [];
        if(event.target.checked){
            this.posts.forEach(function(element) {
                array_del.push(element.id);
            });
            this.posts_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deletePostEvent(): confirm delete
        @author: Lam
    */
    deletePostEvent(){
        let that = this;
        if ( this.posts.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.posts_del.length + " phần tử đã chọn",
                buttons: {
                    cancel: {
                        label: "Hủy"
                    },
                    confirm: {
                        label: "Xóa"
                    }
                },
                callback: function (result) {
                    if(result) {
                        that.onDeletePost();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDeletePost(): 
         + Callback service function onDeletePost() delete post by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeletePost(){
        this.postService.onDelPostSelect(this.posts_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.posts_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.posts_del = [];
                });
                this.message_result = "Xóa thành công.";
            }
        );
    }

}
