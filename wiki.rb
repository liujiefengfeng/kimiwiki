#!/usr/bin/env ruby

require './.init'

command :new, :category do |lst|
    pp "category", lst
end

command :new, :post do |lst|
    pp "post", lst
end

command :new, :last do |lst|
    pp "last", lst
end

command :new do |lst|
    pp "new", lst
end


run_command();