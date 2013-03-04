<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ken
 * Date: 2/4/12
 * Time: 6:17 PM
 * To change this template use File | Settings | File Templates.
 */
$pageContent = apply_filters('get_page_content', '');

get_header();

if (!empty($pageContent)) {
   echo $pageContent;
} else {
   ?><div class="wysiwyg"><?php
   the_post();
   echo the_content();
   ?></div><?php
}
get_footer();
